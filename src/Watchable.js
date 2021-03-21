import { v4 as uuidv4 } from "uuid";

export const ProxyPrototype = class {};

export const wrapNested = (root, prop, input) => {
    if(input instanceof ProxyPrototype) {
        return input;
    } else if(input instanceof Watchable) {
        input.$.subscribe((p, v) => root.$.emit(`${ prop }.${ p }`, v));

        return input;
    }

    const proxy = new Proxy(input, {
        getPrototypeOf(t) {
            return ProxyPrototype.prototype;
        },
        get(t, p) {
            return t[ p ];
        },
        set(t, p, v) {
            if(p.startsWith("_")) {      // Don't emit any _Private/__Internal variables
                t[ p ] = v;

                return t;
            }
            
            if(typeof v === "object") {
                let ob = wrapNested(root, `${ prop }.${ p }`, v);

                t[ p ] = ob;
            } else {
                t[ p ] = v;
            }
            
            if(!(Array.isArray(input) && p in Array.prototype)) {   // Don't emit native <Array> keys (i.e. .push returns .length)
                root.$.emit(`${ prop }.${ p }`, v);
            }

            return t;
        },
    });

    for(let [ key, value ] of Object.entries(input)) {
        if(typeof value === "object") {
            proxy[ key ] = wrapNested(root, `${ prop }.${ key }`, value);
        }
    }

    return proxy;
};

export class Watchable {
    constructor(state = {}, { deep = true } = {}) {
        this.__id = uuidv4();

        this.__subscribers = new Map();
        
        const _this = new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                if(target[ prop ] === value || prop === "$") {
                    return target;
                }
                
                if(prop.startsWith("_") || (Object.getOwnPropertyDescriptor(target, prop) || {}).set !== void 0) {      // Don't emit any _Private/__Internal variables
                    target[ prop ] = value;

                    return target;
                }

                if(deep && typeof value === "object") {
                    target[ prop ] = wrapNested(target, prop, value);

                    target.$.emit(prop, target[ prop ]);
                } else {
                    target[ prop ] = value;

                    target.$.emit(prop, value);
                }

                return target;
            }
        });

        if(typeof state === "object") {
            for(let [ key, value ] of Object.entries(state)) {
                _this[ key ] = value;
            }
        }

        return _this;
    }

    // Method wrapper to easily prevent { key : value } collisions
    get $() {
        const _this = this;

        return {
            get id() {
                return _this.__id;
            },

            async emit(prop, value) {
                for(let subscriber of _this.__subscribers.values()) {
                    const payload = {
                        prop,
                        value,
                        subject: _this,
                        emitter: _this,
                        subscriber,
                    };
        
                    if(typeof subscriber === "function") {
                        subscriber.call(payload, prop, value);
                    } else if(subscriber instanceof Watchable) {
                        subscriber.$.emit.call(payload, prop, value);
                    }
                }
        
                return _this;
            },

            purge(deep = false) {
                _this.__subscribers.clear();
        
                if(deep) {
                    for(let [ key, value ] of Object.entries(_this)) {
                        if(value instanceof Watchable) {
                            value.$.purge(true);
                        }
                    }
                }
        
                return _this;
            },
        
            subscribe(input) {
                if(typeof input === "function") {
                    const uuid = uuidv4();
                    _this.__subscribers.set(uuid, input);
        
                    return uuid;
                } else if(input instanceof Watchable) {
                    _this.__subscribers.set(input.$.id, input);
        
                    return input.$.id;
                }
        
                return false;
            },
            unsubscribe(nextableOrFn) {
                return _this.__subscribers.delete(nextableOrFn);
            },
        
            toData({ includePrivateKeys = false } = {}) {
                const obj = {};
            
                if("__arrayLength" in _this) {
                    const arr = [];
                    for(let i = 0; i < _this.__arrayLength; i++) {
                        const entry = _this[ i ];
        
                        if(entry instanceof Watchable) {
                            arr.push(entry.$.toData());
                        } else {
                            arr.push(entry);
                        }
                    }
        
                    return arr;
                }
        
                if(includePrivateKeys) {
                    for(let [ key, value ] of Object.entries(_this)) {
                        if(!key.startsWith("__")) {
                            if(value instanceof Watchable) {
                                obj[ key ] = value.$.toData();
                            } else {
                                obj[ key ] = value;
                            }
                        }
                    }
            
                    return obj;
                }
        
                for(let [ key, value ] of Object.entries(_this)) {
                    if(!key.startsWith("_")) {
                        if(value instanceof Watchable) {
                            obj[ key ] = value.$.toData();
                        } else {
                            obj[ key ] = value;
                        }
                    }
                }
            
                return obj;
            },
        }
    }
};

export default Watchable;