import Proposition from "./Proposition";

export class Mutator {
    constructor(methods = [], proposition) {
        if(proposition instanceof Proposition) {
            this.__proposition = proposition;
        } else if(typeof proposition === "function") {
            this.__proposition = Proposition.OR(proposition);
        } else {
            this.__proposition;
        }

        this.__methods = methods;
    }

    add(fn) {
        this.__methods.push(fn);

        return this;
    }
    remove(fn) {
        this.__methods = this.__methods.filter(f => f !== fn);

        return this;
    }

    /**
     * Iteratively execute all stored methods, discarding return values
     */
    process(...args) {
        if(this.__proposition) {
            if(this.__proposition.test(...args) === true) {
                for(let fn of this.__methods) {
                    fn(...args);
                }

                return true;
            }

            return false;
        }
        
        for(let fn of this.__methods) {
            fn(...args);
        }

        return true;
    }
    /**
     * Take @obj and reassign each subsequent reducer execution result, iteratively mutating @obj
     */
    mutate(obj = {}, ...args) {
        if(this.__proposition) {
            if(this.__proposition.test(...args) === true) {
                for(let fn of this.__methods) {
                    obj = fn(obj, ...args);
                }
            }
        } else {
            for(let fn of this.__methods) {
                obj = fn(obj, ...args);
            }
        }

        return obj;
    }

    //? .select|apply|change allow the <Mutator> to filter entries-as-kvp-objects
    //?     via @__proposition and change each remaining { key: value } by iterative
    //?     assignment via @this.__methods (obj[ key ] = ...fns(...))
    select(obj = {}) {
        const res = {};
        if(this.__proposition) {
            for(let [ key, value ] of Object.entries(obj)) {
                if(this.__proposition.test(key, value) === true) {
                    res[ key ] = value;
                }
            }
        }

        return res;
    }
    apply(obj = {}, ...args) {
        for(let [ key, value ] of Object.entries(obj)) {
            for(let fn of this.__methods) {
                obj[ key ] = fn(obj[ key ], key, ...args);
            }
        }

        return obj;
    }
    change(obj, ...args) {
        return this.apply(this.select(obj), ...args);
    }
}

export default Mutator;