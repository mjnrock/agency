import { v4 as uuidv4, validate } from "uuid";

export class AgencyBase {
	static Repository = new Map();

	static Register(object) {
		if(typeof object === "object" && validate(object.id)) {
			AgencyBase.Repository.set(object.id, object);

			return true;
		}

		return false;
	}
	static Unregister(objectOrId) {
		if(typeof objectOrId === "object") {
			return AgencyBase.Repository.delete(objectOrId.id);
		} else if(validate(objectOrId)) {
			return AgencyBase.Repository.delete(objectOrId);
		}

		return false;
	}

    constructor() {
        const proxy = new Proxy(this, {
            get(target, prop) {
                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
                if(target[ prop ] === value) {
                    return target;
                }
                
                if(prop[ 0 ] === "_" || (Object.getOwnPropertyDescriptor(target, prop) || {}).set) {
                    return Reflect.defineProperty(target, prop, {
                        value,
                        configurable: true,
                        writable: true,
                        enumerable: false,
                    });
                }

                return Reflect.set(target, prop, value);
            },
        });

        proxy.__id = uuidv4();

		//FIXME	WeakMap vs. Map and cleanup
		// AgencyBase.Register(proxy);

        return proxy;
    }

	__deconstructor() {
		AgencyBase.Unregister(this);
	}

    [ Symbol.iterator ]() {
        var index = -1;
        var data = Object.entries(this);

        return {
            next: () => ({ value: data[ ++index ], done: !(index in data) })
        };
    }

    get id() {
        return this.__id;
    }
    
    get _keys() {
        return Reflect.ownKeys(this);
    }
    get _values() {
        return Reflect.ownKeys(this).map(key => this[ key ]);
    }
    get _entries() {
        return Reflect.ownKeys(this).map(key => [ key, this[ key ] ]);
    }
};

export default AgencyBase;