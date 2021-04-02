import { v4 as uuidv4 } from "uuid";

export class AgencyBase {
    constructor() {
        const proxy = new Proxy(this, {
            get(target, prop) {
                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
                if(target[ prop ] === value) {
                    return target;
                }
                
                if(value == null || prop[ 0 ] === "_" || (Object.getOwnPropertyDescriptor(target, prop) || {}).set) {
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

        return proxy;
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