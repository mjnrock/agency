import { v4 as uuidv4 } from "uuid";

export const ProxyPrototype = class {};

export const wrapNested = (root, prop, input) => {
    if(input instanceof ProxyPrototype) {
        return input;
    } else if(input instanceof Watchable) {
        input.watch((p, v) => root.broadcast(`${ prop }.${ p }`, v));

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
            if(typeof v === "object") {
                let ob = wrapNested(root, `${ prop }.${ p }`, v);

                t[ p ] = ob;
            } else {
                t[ p ] = v;
            }
            
            if(!(Array.isArray(input) && p in Array.prototype)) {   // Don't broadcast native <Array> keys (i.e. .push returns .length)
                root.broadcast(`${ prop }.${ p }`, v);
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

        this.__watchers = new Map();
        
        const _this = new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                if(prop.startsWith("_")) {      // Don't broadcast any _Private/__Internal variables
                    target[ prop ] = value;

                    return target;
                }

                if(deep) {
                    if(typeof value === "object") {
                        let ob = wrapNested(target, prop, value);

                        target[ prop ] = ob;

                        target.broadcast(prop, ob);
                    } else {
                        target[ prop ] = value;

                        target.broadcast(prop, value);
                    }
                } else {
                    target[ prop ] = value;

                    target.broadcast(prop, value);
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

    async broadcast(prop, value) {
        for(let watcher of this.__watchers.values()) {
            const payload = {
                prop,
                value,
                target: this,
                watcher,
            };

            if(typeof watcher === "function") {
                watcher.call(payload, prop, value);
            } else if(watcher instanceof Watchable) {
                watcher.next.call(payload, prop, value);
            }
        }

        return this;
    }

    get id() {
        return this.__id;
    }

    purge(deep = false) {
        this.__watchers.clear();

        if(deep) {
            for(let [ key, value ] of Object.entries(this)) {
                if(value instanceof Watchable) {
                    value.purge(true);
                }
            }
        }

        return this;
    }

    watch(input) {
        if(typeof input === "function") {
            const uuid = uuidv4();
            this.__watchers.set(uuid, input);

            return uuid;
        } else if(input instanceof Watchable) {
            this.__watchers.set(input.id, input);

            return input.id;
        }

        return false;
    }
    unwatch(nextableOrFn) {
        return this.__watchers.delete(nextableOrFn);
    }

    toData({ includePrivateKeys = false } = {}) {
        const obj = {};
    
        if("__arrayLength" in this) {
            const arr = [];
            for(let i = 0; i < this.__arrayLength; i++) {
                const entry = this[ i ];

                if(entry instanceof Watchable) {
                    arr.push(entry.toData());
                } else {
                    arr.push(entry);
                }
            }

            return arr;
        }

        if(includePrivateKeys) {
            for(let [ key, value ] of Object.entries(this)) {
                if(!key.startsWith("__")) {
                    if(value instanceof Watchable) {
                        obj[ key ] = value.toData();
                    } else {
                        obj[ key ] = value;
                    }
                }
            }
    
            return obj;
        }

        for(let [ key, value ] of Object.entries(this)) {
            if(!key.startsWith("_")) {
                if(value instanceof Watchable) {
                    obj[ key ] = value.toData();
                } else {
                    obj[ key ] = value;
                }
            }
        }
    
        return obj;
    }
};

export default Watchable;