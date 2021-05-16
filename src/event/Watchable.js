import AgencyBase from "./../AgencyBase";
import { flatten, unflatten, recurse } from "./../util/helper";

export const WatchableArchetype = class extends AgencyBase {
    constructor() {
        super();
    }
};

export const wrapNested = (controller, prop, input) => {
    if(input instanceof WatchableArchetype) {
        return input;
    } else if(prop[ 0 ] === "_") {
        return input;
    } else if(typeof input !== "object") {
        return input;
    }

    for(let [ key, value ] of Object.entries(input)) {
        if(typeof value === "object") {
            let kprop = `${ prop }.${ key }`;
            
            input[ key ] = wrapNested(controller, kprop, value);
        }
    }

    const proxy = new Proxy(input, {
        getPrototypeOf(t) {
            return WatchableArchetype.prototype;
        },
        get(t, p) {
            if(controller.useControlMessages) {
                if((Reflect.getOwnPropertyDescriptor(t, p) || {}).enumerable) {
                    controller.controller.dispatch(Watchable.ControlType.READ, `${ prop }.${ p }`);
                }
            }

            return Reflect.get(t, p);
        },
        set(t, p, v) {
            const current = t[ p ];

            let nprop = `${ prop }.${ p }`;

            if(t[ p ] === v) {  // Ignore if the old value === new value
                return t;
            }

            let isNewlyCreated = current === void 0;
            
            if(p[ 0 ] === "_" || (Reflect.getOwnPropertyDescriptor(t, p) || {}).set) {
                return Reflect.defineProperty(t, p, {
                    value: v,
                    configurable: true,
                    writable: true,
                    enumerable: false,
                });
            }
            
            if(typeof v === "object") {
                let ob = wrapNested(controller, nprop, v);

                Reflect.set(t, p, ob);
            } else {
                Reflect.set(t, p, v);
            }
            
            if(!(Array.isArray(input) && p in Array.prototype)) {   // Don't broadcast native <Array> keys (i.e. .push returns .length)
                if(controller.useControlMessages) {
                    if(isNewlyCreated) {
                        controller.controller.dispatch(Watchable.ControlType.CREATE, nprop, v);
                    } else {
                        controller.controller.dispatch(Watchable.ControlType.UPDATE, nprop, v, current);
                    }
                } else {
                    if(isNewlyCreated) {
                        controller.controller.dispatch(nprop, v);
                    } else {
                        controller.controller.dispatch(nprop, v, current);
                    }
                }
            }

            return t;
        },
        deleteProperty(t, p) {
            if(p in t) {                
                const reflect = Reflect.deleteProperty(t, p);

                let nprop = `${ prop }.${ p }`;

                if(controller.useControlMessages) {
                    controller.controller.dispatch(Watchable.ControlType.DELETE, nprop, void 0);
                } else {
                    controller.controller.dispatch(nprop, void 0);
                }

                return reflect;
            }

            return false;
        },
    });

    return proxy;
};

/**
 * The <Watchable> is an <Object> that emits changes to itself
 *  to a <Network>.  Newly added values to the <Watchable> are
 *  wrapped in a watcher for nested object changes.
 * 
 * CRUD-like messaging is available with use of the @useControlMessages
 *  flag.  A property *must be enumerable* in order for a message to fire.
 *  If @useControlMessages is *false*, then the "READ" messages are *not* fired.
 */
export class Watchable extends WatchableArchetype {
    static ControlType = {
        CREATE: `Watchable:Create`,
        READ: `Watchable:Read`,
        UPDATE: `Watchable:Update`,
        DELETE: `Watchable:Delete`,
    };

    /**
     * @isStateSchema bool | false | Function values will be evaluated at one (1) level of depth [ i.e. (f => g => {})(this, key, value) --> g => {} ]
     * @emitProtected bool | false | Emit updates for props like `_%` (i.e. one (1) preceding underscore)
     * @emitPrivate bool | false | Emit updates for props like `__%` (i.e. two (2) preceding underscores)
     * @useControlMessages bool | false | Use << Watchable.ControlType >> for CRUD-like messaging from the <Watchable>.  These can be used for event-listening for data syncing.
     */
    constructor(network, state = {}, { isStateSchema = false, emitProtected = false, emitPrivate = false, useControlMessages = false } = {}) {
        super();

        this.__controller = {
            controller: network.join(this, { callback: (...args) => this.__receiveHook(...args) }),
            useControlMessages,
        };

        for(let [ key, value ] of Object.entries(state)) {
            let newValue;
            if(isStateSchema && typeof value === "function") {
                newValue = value(this, key, value);
            } else if(typeof value === "object") {
                newValue = wrapNested(this.__controller, key, value);
            } else {
                newValue = value;
            }

            Reflect.set(this, key, newValue);
        }

        const proxy = new Proxy(this, {
            get(target, prop) {
                if((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    let props = prop.split(".");

                    if(props[ 0 ] === "$") {
                        props = props.slice(1);
                    }
                    
                    let result = target;
                    let i = 0;
                    for(let p of props) {
                        if(typeof result === "object") {
                            if(target.__controller.useControlMessages) {
                                if(i === 0 && (Reflect.getOwnPropertyDescriptor(target, prop) || {}).enumerable) {
                                    target.__controller.controller.dispatch(Watchable.ControlType.READ, p);
                                }
                            }
                            let next = Reflect.get(result, p);
    
                            if(next !== void 0) {
                                result = next;
                            }
                        } else {
                            return void 0;  // Selection does not exist
                        }

                        ++i;
                    }

                    if(result !== target) {
                        return result;
                    } else {
                        return;
                    }
                }

                if(target.__controller.useControlMessages) {
                    if((Reflect.getOwnPropertyDescriptor(target, prop) || {}).enumerable) {
                        target.__controller.controller.dispatch(Watchable.ControlType.READ, prop);
                    }
                }

                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
                const current = target[ prop ];

                if(current === value) {
                    return target;
                } else if(prop[ 0 ] === "_") {
                    if(emitProtected !== true) {
                        return Reflect.set(target, prop, value);
                    } else if(prop[ 1 ] === "_") {
                        if(emitPrivate !== true) {
                            return Reflect.set(target, prop, value);
                        }
                    }
                }

                let newValue;
                if(typeof value === "object") {
                    newValue = wrapNested(target.__controller, prop, value);
                } else {
                    newValue = value;
                }

                let isNewlyCreated = current === void 0;
                let reflect = Reflect.set(target, prop, newValue);

                if(target.__controller.useControlMessages) {
                    if(isNewlyCreated) {
                        target.__controller.controller.dispatch(Watchable.ControlType.CREATE, prop, newValue);
                    } else {
                        target.__controller.controller.dispatch(Watchable.ControlType.UPDATE, prop, newValue, current);
                    }
                } else {
                    if(isNewlyCreated) {
                        target.__controller.controller.dispatch(prop, newValue);
                    } else {
                        target.__controller.controller.dispatch(prop, newValue, current);
                    }
                }

                return reflect;
            },
            deleteProperty(target, prop) {
                const reflect = Reflect.deleteProperty(target, prop);

                if(target.__controller.useControlMessages) {
                    target.__controller.controller.dispatch(Watchable.ControlType.DELETE, prop, void 0);
                } else {
                    target.__controller.controller.dispatch(prop, void 0);
                }

                return reflect;
            },
        });

        return proxy;
    }

    /**
     * Arguments are passed directly to << .toString >>
     * Final buffer has the following concatenation:
     * [ primaryLength ][ primaryChar(s) ][ secondaryLength ][ secondaryChar(s) ][ << this.toString(...args) >> ]
     * 
     * E.g. primary="|",secondary=":",this={ test: true } --> `1|1:test:true`
     * E.g. both=".",this={ test: true, another: "yes" } --> `1.1.test.true.another.yes`
     */
    toBuffer({ primary = "|", secondary = ":", all } = {}) {
        const str = this.toString({ primary, secondary, all });
        const buffer = Buffer.from(`${ primary.length }${ primary }${ secondary.length }${ secondary }${ str }`);

        return buffer;
    }
    toString({ primary = "|", secondary = ":", all } = {}) {
        if(all) {
            primary = secondary = all.toString();
        }

        return flatten(this, { asArray: true }).map(([ k, v ]) => `${ k }${ secondary }${ v }`).join(primary);
    }
    toObject() {
        return JSON.parse(this.toJson());
    }
    toSchemaObject() {        
        const obj = this.toObject();

        return recurse(obj, {
            setter: (key, value) => ({
                type: typeof value,
                value: value,
            }),
        });
    }
    toJson() {
        return JSON.stringify(this);
    }

    static Flatten(watchable, opts = {}) {
        return flatten(watchable, opts);
    }
    static Unflatten(network, obj, opts = {}, unflattenOpts = {}) {
        return new Watchable(network, unflatten(obj, unflattenOpts), opts);
    }
};

/**
 * @qty may be a number or a fn(network, args)
 * @args may be direct arguments or a fn(i, network) to determine appropriate arguments for that iteration
 * Returns one (1) <Watchable> if @qty === 1 and [ ...<Watchable> ] if @qty > 1
 */
export function Factory(network, args = [], qty = 1) {
    if(typeof qty === "function") {
        qty = qty(network, args);
    }

    const results = [];
    for(let i = 0; i < qty; i++) {
        let localArgs;
        if(typeof args === "function") {
            localArgs = args(i, network);
        } else {
            if(Array.isArray(args)) {
                localArgs = args;
            } else {
                localArgs = [ args ];
            }
        }

        const watch = new Watchable(network, ...localArgs);

        results.push(watch);
    }

    if(results.length > 1) {
        return results;
    }

    return results[ 0 ];
};

/**
 * Identical to << Factory >>, except that functions can be
 *  async functions.  This returns a resolved <Promise> with
 *  the final <Watchable> value(s).
 */
export async function AsyncFactory(network, args = [], qty = 1) {
    if(typeof qty === "function") {
        qty = await qty(network, args);
    }

    const results = [];
    for(let i = 0; i < qty; i++) {
        let localArgs;
        if(typeof args === "function") {
            localArgs = await args(i, network);
        } else {
            if(Array.isArray(args)) {
                localArgs = args;
            } else {
                localArgs = [ args ];
            }
        }

        const watch = new Watchable(network, ...localArgs);

        results.push(watch);
    }

    if(results.length > 1) {
        return Promise.resolve(results);
    }

    return Promise.resolve(results[ 0 ]);
};

export default Watchable;