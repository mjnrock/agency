import AgencyBase from "./../AgencyBase";

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

    const proxy = new Proxy(input, {
        getPrototypeOf(t) {
            return WatchableArchetype.prototype;
        },
        get(t, p) {
            return Reflect.get(t, p);
        },
        set(t, p, v) {
            let nprop = `${ prop }.${ p }`;

            if(t[ p ] === v) {  // Ignore if the old value === new value
                return t;
            }
            
            if(p[ 0 ] === "_" || (Object.getOwnPropertyDescriptor(t, p) || {}).set) {
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
                controller.dispatch(nprop, v);
            }

            return t;
        },
    });

    for(let [ key, value ] of Object.entries(input)) {
        if(typeof value === "object") {
            let kprop = `${ prop }.${ key }`;
            
            proxy[ key ] = wrapNested(controller, kprop, value);
        }
    }

    return proxy;
};

export class Watchable extends WatchableArchetype {
    /**
     * @isStateSchema bool | false | Function values will be evaluated at one (1) level of depth [ i.e. (f => g => {})(this, key, value) --> g => {} ]
     * @emitProtected bool | false | Emit updates for props like `_%` (i.e. one (1) preceding underscore)
     * @emitPrivate bool | false | Emit updates for props like `__%` (i.e. two (2) preceding underscores)
     */
    constructor(network, state = {}, { isStateSchema = false, emitProtected = false, emitPrivate = false } = {}) {
        super();

        this.__controller = network.join(this, { callback: (...args) => this.__receiveHook(...args) });

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
                    for(let p of props) {
                        if(result[ p ] !== void 0) {
                            result = result[ p ];
                        }
                    }

                    if(result !== target) {
                        return result;
                    } else {
                        return;
                    }
                }

                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
                if(target[ prop ] === value) {
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

                let reflect = Reflect.set(target, prop, newValue);

                target.__controller.dispatch(prop, newValue);

                return reflect;
            },
        });

        return proxy;
    }
};

/**
 * @args may be direct arguments or a fn(i, network) to determine appropriate arguments for that iteration
 * Returns one (1) <Watchable> if @qty === 1 and [ ...<Watchable> ] if @qty > 1
 */
export function Factory(network, args = [], qty = 1) {
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
}

export default Watchable;