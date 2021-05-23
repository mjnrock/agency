import { v4 as uuidv4, validate } from "uuid";

import AgencyBase from "./AgencyBase";
import { compose } from "./util/helper";

/**
 * NOTE:    Only *actual* entries will appear if you enumerate @this, and as such, the <$Registry>
 *          can be used as a value iterator.  Accessing the registry via a synonym will return the
 *          referential entry, if it exists.
 * 
 * Origin-Only Variables
 * ---------------------------------
 *  The variables below can only be set during instantiation of <$Registry>
 * 
 * @typed {?fn} | A set trap that must be true to proceed (e.g. instanceof ClassX)
 * @accessor {?fn} | A get trap that will accept the entry as its args --> fn(target[ prop ]) (e.g. factory methods)
 *  - @accessorArgs {?obj} | Include additional arguments to be passed to the @accessor into perpetuity
 */
export const $Registry = $super => class extends $super {
    constructor({ Registry = {}, ...rest } = {}) {
        super({ ...rest });

        Reflect.defineProperty(this, "__cache", {	// Used primarily for the reregistration of objects
			value: new WeakMap(),
			configurable: false,
			writable: true,
			enumerable: false,
		});
        Reflect.defineProperty(this, "__state", {
			value: {},
			configurable: false,
			writable: true,
			enumerable: false,
		});

        const proxy = new Proxy(this, {
            get(target, prop) {
                if(typeof Registry.accessor === "function") {                
                    return Registry.accessor(target, prop, Registry.accessorArgs || {});
                }
                
                if(prop in target) {
                    return Reflect.get(target, prop);
                }

                return Reflect.get(target.__state, prop);
            },
            set(target, prop, value) {                
                if (validate(prop)) {        // assignment                    
                    if(typeof Registry.typed === "function" && Registry.typed(prop, value, target[ prop ]) !== true) {
                        return target;
                    }
                    
                    return Reflect.defineProperty(target, prop, {
                        value,
                        configurable: true,
                        writable: true,
                        enumerable: true,
                    });
                } else if (validate(value)) {    // sic | synonym assignment
                    if(target[ value ] === void 0) {    // short circuit if a potential synonym doesn't have an anchor entry
                        return target;
                    }

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

                return Reflect.set(target.__state, prop, value);
            },
        });

        for(let entry of (Registry.entries || [])) {
            if(Array.isArray(entry)) {
                proxy.register(...entry);
            } else {
                proxy.register(entry);
            }
        }

        return proxy;
    }

    get state() {
        return this.__state;
    }

    get size() {
        return Object.keys(this).length;
    }

    has(entry, comparator) {
        if(typeof comparator === "function") {
            for(let value of this) {
                if(comparator(entry, value) === true) {
                    return true;
                }
            }
        } else {
            for(let value of this) {
                if(value === entry) {
                    return true;
                }
            }
        }

        return false;
    }
    
    /**
     * ! [Special Case]:    <Registry> iteration is VALUES ONLY, because the UUID is internal and synonyms are virtualized.
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
            if ((k[ 0 ] !== "_" || (k[ 0 ] === "_" && k[ 1 ] !== "_")) && !validate(k)) {
                return [ ...a, k ];
            }

            return a;
        }, []);
    }

    register(entry, ...synonyms) {
        //  Prevent anything with an establish "id" from registering multiple times, as it's already an Object and addressed
        if (this[ (entry || {}).__id || (entry || {}).id ] !== void 0) {
            return false;
        }

        let uuid = this.__cache.get(entry) || (entry || {}).__id || (entry || {}).id || uuidv4();

        this[ uuid ] = entry;

        //  Re-registration, reuse the previous id
        if(typeof entry === "object" && !this.__cache.has(entry)) {
            this.__cache.set(entry, uuid);
        }

        for (let synonym of synonyms) {
            this[ synonym ] = uuid;
        }

        return uuid;
    }
    unregister(lookup) {        
        let result = this[ (lookup || {}).__id || (lookup || {}).id || lookup ];
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

export class Registry extends compose($Registry)(AgencyBase) {
    static Instances = new Registry();
    constructor(registerArgs = [], opts = {}) {
        super(opts);

        for(let args of registerArgs) {
            if(!Array.isArray(args)) {
                args = [ args ];
            }
            
            this.register(...args);
        }
    }
    
    /**
     * A convenience getter to easily access a default <Registry>
     *  when a multi-Registry setup is unnecessary.
     */
    static get $() {
        if(!(Registry.Instances || {}).default) {
            Registry.Recreate();
        }

        return Registry.Instances.default;
    }
    static get _() {
        if(!Registry.Instances) {
            Registry.Recreate();
        }

        return Registry.Instances;
    }
    
    /**
     * Recreate the .Instances registry with optional seeding
     */
    static Recreate(registries = [], createDefault = true) {
        Registry.Instances = new Registry({ Registry: { entries: registries }});

        if(createDefault) {
            Registry.Instances.register(new Registry(), "default");
        }
    }
};

export default Registry;