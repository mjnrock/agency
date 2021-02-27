import { v4 as uuidv4 } from "uuid";
import Mutator from "./Mutator";

//TODO Consider merging to a scheme with syntactic naming
/**
 * These would all affect how .toData() and .next() process them
 * `${ var }`    | public variable: [ next, toData, toDetail ]
 * `$${ var }`   | meta variable: [ next, toDetail ]
 * `__${ var }`  | private variable: [ toDetail ]
 */

/**
 * The <Observable> is basically just a watchable <Object>
 *      and should basically always be used with an <Observer>
 * .next will provide direct access to updates, while an <Observer> will emit
 *      each prop change as an eponymously named event, as well as a "next" event
 *      as a catch-all
 * Nesting an <Observable> will result in a reassignment of its .next
 *      As such, the .next cannot be nested and be watched *directly*
 *      Use either by a parent <Observable> nesting it, or by an <Observer> watching it, but not both.
 */
//? Only watch events at the root <Observable>, to avoid losing <Observer> bindings
//?     All updates will get bubbled into a .next(dot-notation-prop, value) invocation
export class Observable {
    constructor(deep = true, { noWrap = false } = {}) {
        this.__id = uuidv4();

        if(noWrap) {
            return this;
        }
        
        return new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                if(Array.isArray(value)) {
                    target[ prop ] = value;
                } else if(deep && (typeof value === "object" || value instanceof Observable)) {
                    const ob = value instanceof Observable ? value : Factory(value);
                    ob.next = (...args) => {
                        const props = [ prop, ...args.slice(0, args.length - 1) ].join(".");

                        target.next(props, args.pop());
                    };

                    target[ prop ] = ob;
                } else {
                    target[ prop ] = value;
                }

                target.next(prop, target[ prop ]);

                return target;
            }
        });
    }

    get next() {
        if(typeof this.__next === "function" || this.__next instanceof Mutator) {
            return this.__next;
        }

        return () => {};
    }
    set next(fn) {
        if(typeof fn === "function") {
            this.__next = (...args) => new Promise((resolve, reject) => {
                resolve(fn(...args));
            });
        } else if(fn instanceof Mutator) {
            this.__next = (...args) => new Promise((resolve, reject) => {
                resolve(fn.process(...args));
            });
        }

        return this;
    }

    /**
     * For the most part, this is sufficient for only grabbing custom functions and ignoring property methods
     *      That being said, override in ancestor if issues arise
     */
    toData() {
        const obj = {};
    
        for(let [ key, value ] of Object.entries(this)) {
            if(key[ 0 ] !== "_" || (key[ 0 ] === "_" && key[ 1 ] !== "_")) {
                if(value instanceof Observable) {
                    obj[ key ] = value.toData();
                } else {
                    obj[ key ] = value;
                }
            }
        }
    
        return obj;
    };
};

//? Use the .Factory method to create a <Observable> with default state
export function Factory(state = {}, isDeep = true) {
    const obs = new Observable(isDeep);
    
    if(state instanceof Observable) {
        state = state.toData();
    }

    if(typeof state === "object") {
        for(let [ key, value ] of Object.entries(state)) {
            obs[ key ] = value;
        }
    }

    return obs;
};

//FIXME This is still mostly a work in progress, as it doesn't yet do what it's meant to
export function Wrap(obj = {}) {
    return new Proxy(obj, {
        get(target, prop) {
            return target[ prop ];
        },
        set(target, prop, value) {
            target[ prop ] = value;

            if(typeof target.next === "function") {
                target.next(prop, target[ prop ]);
            } else if(target.next instanceof Mutator) {
                target.next.process(prop, target[ prop ]);
            }

            return target;
        }
    });
};

Observable.Factory = Factory;
// Observable.Wrap = Wrap;

export default Observable;