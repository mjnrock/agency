import { v4 as uuidv4, validate } from "uuid";

import Watchable from "./Watchable";

export class Registry extends Watchable {
    constructor(entries = [], state = {}, { deep = true, nestedProps } = {}) {
        super(state, { deep, nestedProps });

        this.__props = {
            size: 0,
        };

        for(let entry of entries) {
            if(Array.isArray(entry)) {
                this.register(...entry);
            } else {
                this.register(entry);
            }
        }
            
        const proxy = new Proxy(this, {
            get(target, prop) {
                if(!validate(prop) && validate(target[ prop ])) {   // prop is NOT a uuid AND target[ prop ] IS a uuid --> prop is a synonym
                    const entry = target[ target[ prop ] ];

                    if(entry !== void 0) {
                        return entry;
                    }
                }

                return target[ prop ];
            },
            set(target, prop, value) {
                if(validate(prop) || validate(value)) {
                    target[ prop ] = value;
                }
    
                return target;
            }
        });

        return proxy;
    }

    get $() {
        const _this = this;
        const _broadcast = super.$.broadcast;

        return {
            ...super.$,

            synId(synonym) {
                return _this.$.target[ synonym ];
            },

            async broadcast(prop, value) {
                if(validate(prop.substring(0, 36))) {
                    prop = prop.slice(37);
                }

                _broadcast.call("emitter" in this ? this : _this.$.proxy, prop, value);
        
                return _this;
            },
        };
    }

    get size() {
        return this.__props.size;
    }

    get keys() {
        return Object.keys(this).reduce((a, key) => {
            if(key[ 0 ] !== "_" || (key[ 0 ] === "_" && key[ 1 ] !== "_")) {
                return [ ...a, key ];
            }

            return a;
        }, []);
    }
    get values() {
        return Object.keys(this).reduce((a, k) => {
            if(validate(k)) {
                return [ ...a, this[ k ] ];
            }

            return a;
        }, []);
    }
    get entries() {
        return Object.keys(this).reduce((a, k) => {
            if(validate(k)) {
                return [ ...a, [ k, this[ k ] ] ];
            }

            return a;
        }, []);
    }
    get records() {
        const obj = {};
        for(let key of Object.keys(this)) {
            if(key[ 0 ] !== "_" || (key[ 0 ] === "_" && key[ 1 ] !== "_")) {
                const entry = this[ key ];

                if(validate(entry)) {
                    obj[ entry ] = [
                        ...((obj || [])[ entry ] || []),
                        key,
                    ];
                } else if(validate(key)) {
                    obj[ key ] = [
                        ...((obj || [])[ key ] || []),
                        entry,
                    ];
                }
            }
        }
        
        return obj;
    }
    
    get ids() {
        return Object.keys(this).reduce((a, v) => {
            if(validate(v)) {
                return [ ...a, v ];
            }

            return a;
        }, []);
    }
    get synonyms() {
        return Object.keys(this).reduce((a, k) => {
            if((k[ 0 ] !== "_" || (k[ 0 ] === "_" && k[ 1 ] !== "_")) && validate(this[ k ])) {
                return [ ...a, k ];
            }

            return a;
        }, []);
    }

    register(entry, ...synonyms) {
        //  Prevent anything with an establish "id" from registering multiple times, as it's already an Object and addressed
        if(this[ (entry || {}).__id ] !== void 0) {
            return false;
        }

        let uuid = (entry || {}).__id || uuidv4();
        
        this[ uuid ] = entry;
        this.__props.size += 1;

        for(let synonym of synonyms) {
            this[ synonym ] = uuid;
        }

        return this;
    }
    unregister(entrySynonymOrId) {
        let uuid;
        if(validate(entrySynonymOrId)) {
            uuid = entrySynonymOrId;
        } else {
            let synid = this.$.synId(entrySynonymOrId);

            if(validate(synid)) {
                uuid = synid;
            } else {
                uuid = (entrySynonymOrId || {}).__id;
            }
        }
        
        if(uuid) {
            const entry = this[ uuid ];
            for(let [ key, value ] of Object.entries(this)) {
                if(value === entry) {   // this[ synonym ] will return the this[ uuid ], because of the Proxy get trap, thus @entry
                    delete this[ key ];
                }
            }

            delete this[ uuid ];
            this.__props.size -= 1;
        }

        return this;
    }
};

export function Factory(deep) {
    return new Registry(deep);
};

Registry.Factory = Factory;

export default Registry;