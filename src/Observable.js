import { v4 as uuidv4 } from "uuid";

export class Observable {
    constructor(state = {}) {
        this.__id = uuidv4();

        this.__subscribers = new Set();
        
        //TODO  Object.getOwnPropertyDescriptor(object1, 'property1').get/.set to check if is a getter/setter and thus ignore
        // const { get: getter, set: setter } = Object.getOwnPropertyDescriptor(target, prop);
        // if(getter) {

        // }
        // if(setter) {

        // }
        
        const _this = new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                target[ prop ] = value;

                for(let subscriber of target.__subscribers.values()) {
                    const payload = {
                        target,
                        subscriber,
                    };

                    if(typeof subscriber === "function") {
                        subscriber(prop, value, payload);
                    } else {
                        subscriber.next(prop, value, payload);
                    }
                }

                return target;
            }
        });

        for(let [ key, value ] of Object.entries(state)) {
            this[ key ] = value;
        }

        return _this;
    }

    watch(nextableOrFn) {
        if(typeof nextableOrFn === "function"
        || nextableOrFn instanceof Observable
        ) {
            this.__subscribers.add(nextableOrFn);

            return true;
        }

        return false;
    }
    unwatch(nextableOrFn) {
        return this.__subscribers.delete(nextableOrFn);
    }

    get next() {
        if(typeof this.__next === "function") {
        // if(typeof this.__next === "function" || this.__next instanceof Mutator) {
            return this.__next;
        }

        return () => {};
    }
    set next(fn) {
        if(typeof fn === "function") {
            this.__next = (...args) => new Promise((resolve, reject) => {
                resolve(fn(...args));
            });
        }

        // if(typeof fn === "function") {
        //     this.__next = (...args) => new Promise((resolve, reject) => {
        //         resolve(fn(...args));
        //     });
        // } else if(fn instanceof Mutator) {
        //     this.__next = (...args) => new Promise((resolve, reject) => {
        //         resolve(fn.process(...args));
        //     });
        // }

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

export default Observable;