import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export default class Validator extends EventEmitter {
    static LogicalType = {
        CONJUNCT: 2 << 0,
        NEGATION: 2 << 1,
    };

    // The bias is an inclusion function that decides (if it returns |true|) to execute the evaluator
    static BiasType = {
        TRUE: () => true,
        FALSE: () => false,
        MAX: (max) => (bias) => bias <= max,
        MIN: (min) => (bias) => bias >= min,
        BETWEEN: (min, max) => (bias) => bias >= min && bias <= max,
    };

    constructor(...evaluators) {
        super();

        this._id = uuidv4();
        this._evaluators = new Map();
        this._bias = () => true;

        this.add(...evaluators);
    }

    get bias() {
        return this._bias;
    }
    set bias(fn) {
        if(typeof fn === "function") {
            this._bias = fn;
        }
    }

    add(...args) {
        if(args.length === 1) {
            const [ fn ] = args;

            if(fn instanceof Validator || typeof fn === "function") {
                this._evaluators.set(fn, [ 1.0, fn ]);

                return this;
            }
        } else if(args.length === 2) {
            const [ bias, fn ] = args;

            if(!(bias instanceof Validator || typeof bias === "function")) {
                this._evaluators.set(fn, [ bias, fn ]);
    
                return this;
            }
        }

        for(let arg of args) {
            if(Array.isArray(arg)) {
                this.add(...arg);
            } else {
                this.add(arg);
            }
        }

        return this;
    }
    remove(...args) {
        for(let fn of args) {
            this._evaluators.delete(fn);
        }

        return this;
    }

    run(mask, ...args) {
        const results = [];
        for(let [ fn, [ bias ]] of this._evaluators.entries()) {
            if(this.bias(bias, fn) === true) {
                results.push(fn(...args));
            }
        }

        let result;
        if((mask & Validator.LogicalType.CONJUNCT) === Validator.LogicalType.CONJUNCT) {
            result = results.every(input => input === true);
        } else {
            result = results.some(input => input === true);
        }

        if((mask & Validator.LogicalType.NEGATION) === Validator.LogicalType.NEGATION) {
            return !result;
        }

        return result;
    }

    getBias(fn) {
        const e = this._evaluators.get(fn);

        if(Array.isArray(e)) {
            return e[ 0 ];
        }

        return false;
    }
    setBias(fn, bias) {
        return this._evaluators.set(fn, [ bias, fn ]);
    }
};