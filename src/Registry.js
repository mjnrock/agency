import { v4 as uuidv4, validate } from "uuid";

import AgencyBase from "./AgencyBase";

export class Registry extends AgencyBase {
    constructor(entries = []) {
        super();

        const proxy = new Proxy(this, {
            get(target, prop) {
                return Reflect.get(target, prop);
            },
            set(target, prop, value) {                
                if (validate(prop)) {        // assignment
                    return Reflect.defineProperty(target, prop, {
                        value,
                        configurable: true,
                        writable: true,
                        enumerable: true,
                    });
                } else if (validate(value)) {    // sic | synonym assignment
                    return Reflect.defineProperty(target, prop, {
                        configurable: true,
                        enumerable: false,
                        get: function () {
                            return Reflect.get(target, value);  // sic
                        },
                        set: function (v) {
                            return Reflect.set(target, prop, value);
                        },
                    });
                }

                return target;
            },
        });

        for(let entry of entries) {
            if(Array.isArray(entry)) {
                proxy.register(...entry);
            } else {
                proxy.register(entry);
            }
        }

        return proxy;
    }

    /**
     * ! [Special Case]:    <Registry> iteration is VALUES ONLY, because the UUID is internal.
     */
    [ Symbol.iterator ]() {
        var index = -1;
        var data = Object.values(this);

        return {
            next: () => ({ value: data[ ++index ], done: !(index in data) })
        };
    };
        
    get synonyms() {
        return Reflect.ownKeys(this).reduce((a, k) => {
            if ((k[ 0 ] !== "_" || (k[ 0 ] === "_" && k[ 1 ] !== "_")) && validate(this[ k ])) {
                return [ ...a, k ];
            }

            return a;
        }, []);
    }
    get records() {
        const obj = {};
        for (let key of Reflect.ownKeys(this)) {
            if (key[ 0 ] !== "_" || (key[ 0 ] === "_" && key[ 1 ] !== "_")) {
                const entry = this[ key ];

                if (validate(entry)) {
                    obj[ entry ] = [
                        ...((obj || [])[ entry ] || []),
                        key,
                    ];
                } else if (validate(key)) {
                    obj[ key ] = [
                        ...((obj || [])[ key ] || []),
                        entry,
                    ];
                }
            }
        }

        return obj;
    }

    register(entry, ...synonyms) {
        //  Prevent anything with an establish "id" from registering multiple times, as it's already an Object and addressed
        if (this[ (entry || {}).__id || (entry || {}).id ] !== void 0) {
            return false;
        }

        let uuid = (entry || {}).__id || (entry || {}).id || uuidv4();

        this[ uuid ] = entry;

        for (let synonym of synonyms) {
            this[ synonym ] = uuid;
        }

        return uuid;
    }
    unregister(lookup) {        
        let result = this[ lookup ];
        let keys = [];

        for(let key of Reflect.ownKeys(this)) {
            const entry = this[ key ];

            if(entry === result || entry === lookup) {
                keys.push(key);
            }
        }

        for(let key of keys) {
            Reflect.deleteProperty(this, key)
        }

        return keys;
    }
};

export default Registry;