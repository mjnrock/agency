import Observable from "./Observable";
import Proposition from "./Proposition";

//TODO  Consider expanding the rules to allow something similar to a CSS Selector/DB Query system for props
/**
 *  "*" can be used to assign the "default rule", which must be true for ALL assignments, if present
 */
export class Context extends Observable {
    constructor({ rules = {}, refs = {}, deep = true } = {}) {
        super(false, { noWrap: true });
        
        this.__rules = new Map();
        this.__references = new Map();

        this.__add(rules);
        this.__include(refs);

        return new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                let newValue = value;

                if(target.__defaultRule(newValue, target[ prop ], { prop, target }) !== true) {
                    return target;
                }

                const rule = target.__rules.get(prop);
                if(typeof rule === "function") {
                    if(rule(newValue, target[ prop ], { prop, target }) !== true) {
                        return target;
                    }
                } else if(rule instanceof Proposition) {
                    if(rule.test(newValue, target[ prop ], { prop, target }) !== true) {
                        return target;
                    }
                }

                if(deep && (typeof newValue === "object" || value instanceof Observable)) {
                    const obs = Observable.Factory(newValue);
                    obs.next = (...args) => {
                        const props = [ prop, ...args.slice(0, args.length - 1) ].join(".");

                        target.next(props, args.pop());
                    };

                    target[ prop ] = obs;
                } else {
                    target[ prop ] = newValue;
                }

                target.next(prop, target[ prop ]);

                return target;
            }
        });
    }

    __defaultRule(...args) {
        const rule = this.__rules.get("*");
        if(typeof rule === "function") {
            return rule(...args);
        } else if(rule instanceof Proposition) {
            return rule.test(...args);
        }

        return true;
    }

    __(key) {
        return this.__references.get(key);
    }

    __add(dotKey, proposition) {
        if(typeof dotKey === "object") {
            for(let [ key, value ] of Object.entries(dotKey)) {
                this.__rules.set(key, value);
            }
        } else {
            this.__rules.set(dotKey, proposition);
        }

        return this;
    }
    __remove(dotKey) {
        this.__rules.delete(dotKey);

        return this;
    }

    __include(name, variable) {
        if(typeof name === "object") {
            for(let [ key, value ] of Object.entries(name)) {
                this.__references.set(key, value);
            }
        } else {
            this.__references.set(name, variable);
        }

        return this;
    }
    __exclude(name) {
        this.__references.delete(name);

        return this;
    }
};

//? Use the .Factory method to create a <Context> with default state
export function Factory(state = {}, { rules = {}, refs = {}, deep } = {}) {
    const ctx = new Context({ rules, refs, deep });
    
    if(state instanceof Context) {
        state = state.toData();
    }

    if(typeof state === "object") {
        for(let [ key, value ] of Object.entries(state)) {
            ctx[ key ] = value;
        }
    }

    for(let [ dotKey, proposition ] of Object.entries(rules)) {
        ctx.__add(dotKey, proposition);
    }
    for(let [ name, variable ] of Object.entries(refs)) {
        ctx.__include(name, variable);
    }

    return ctx;
};

Context.Factory = Factory;

export default Context;