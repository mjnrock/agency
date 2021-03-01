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
                    if(typeof fn === "function") {
                        fn(...args);
                    } else if(fn instanceof Mutator) {
                        fn.process(...args);
                    }
                }

                return true;
            }

            return false;
        }
        
        for(let fn of this.__methods) {
            if(typeof fn === "function") {
                fn(...args);
            } else if(fn instanceof Mutator) {
                fn.process(...args);
            }
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
                    if(typeof fn === "function") {
                        obj = fn(obj, ...args);
                    } else if(fn instanceof Mutator) {
                        obj = fn.mutate(obj, ...args);
                    }
                }
            }
        } else {
            for(let fn of this.__methods) {
                if(typeof fn === "function") {
                    obj = fn(obj, ...args);
                } else if(fn instanceof Mutator) {
                    obj = fn.mutate(obj, ...args);
                }
            }
        }

        return obj;
    }

    //? .select|apply|change allow the <Mutator> to filter entries-as-kvp-objects
    //?     via @__proposition and change each remaining { key: value } by iterative
    //?     assignment via @this.__methods (obj[ key ] = ...fns(...))
    /**
     * A qualifier-filter function designed to test whether object values would activate the <Mutator>
     */
    qualify(obj = {}, ...args) {
        if(Array.isArray(obj)) {
            const res = [];
            if(this.__proposition) {
                for(let i = 0; i < obj.length; i++) {
                    const value = obj[ i ];
                    if(this.__proposition.test(i, value, ...args) === true) {
                        res.push(value);
                    }
                }
            }

            return res;
        }

        const res = {};
        if(this.__proposition) {
            for(let [ key, value ] of Object.entries(obj)) {
                if(this.__proposition.test(key, value, ...args) === true) {
                    res[ key ] = value;
                }
            }
        }

        return res;
    }
    apply(obj = {}, ...args) {
        if(Array.isArray(obj)) {            
            const res = [];
            for(let i = 0; i < obj.length; i++) {
                const value = obj[ i ];
                for(let fn of this.__methods) {
                    if(typeof fn === "function") {
                        res.push(fn(i, value, ...args));
                    } else if(fn instanceof Mutator) {
                        res.push(fn.mutate(value, i, value, ...args));
                    }
                }
            }

            return res;
        }

        for(let [ key, value ] of Object.entries(obj)) {
            for(let fn of this.__methods) {
                if(typeof fn === "function") {
                    obj[ key ] = fn(key, obj[ key ], ...args);
                } else if(fn instanceof Mutator) {
                    obj[ key ] = fn.mutate(obj[ key ], key, obj[ key ], ...args);
                }
            }
        }

        return obj;
    }
    perform(obj = {}, qualifyArgs = [], applyArgs = []) {
        const selected = this.qualify(obj, ...qualifyArgs);
        
        return this.apply(selected, ...applyArgs);
    }
}

export default Mutator;