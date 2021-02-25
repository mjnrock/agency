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
            }

            return this;
        } else {
            for(let fn of this.__methods) {
                fn(...args);
            }

            return this;
        }
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
}

export default Mutator;