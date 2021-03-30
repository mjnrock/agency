import { v4 as uuidv4 } from "uuid";

export default class Proposition {
    static GroupLogicType = {
        CONJUNCT: 2 << 0,
        NEGATION: 2 << 1,
    };

    constructor(...evaluators) {
        this._id = uuidv4();
        this._evaluators = evaluators;
        this._mask = 0;     // The logical group type (dysjunct, conjunct, negation)

        if(typeof evaluators[ 0 ] === "number") {
            this._mask = evaluators[ 0 ];
            this._evaluators = evaluators.slice(1);
        }
    }

    add(...fns) {
        this._evaluators = [
            ...this._evaluators,
            ...fns,
        ];

        return this;
    }
    remove(...fns) {
        for(let fn of fns) {
            this._evaluators = this._evaluators.filter(e => e !== fn);
        }

        return this;
    }

    run(...args) {        
        const results = [];
        for(let fn of this._evaluators) {
            if(typeof fn === "function") {
                results.push(fn(...args));
            } else if(fn instanceof Proposition) {
                results.push(fn.run(...args));
            } else {
                throw new Error("@evaluator must be a function");
            }
        }

        let result;
        if((this._mask & Proposition.GroupLogicType.CONJUNCT) === Proposition.GroupLogicType.CONJUNCT) {
            result = results.every(input => input === true);
        } else {
            result = results.some(input => input === true);
        }

        if((this._mask & Proposition.GroupLogicType.NEGATION) === Proposition.GroupLogicType.NEGATION) {
            result = !result;
        }

        return result;
    }

    //* All static helpers assume that you put the meaningful arguments first
    static IsType(type) {
        return new Proposition((t, ...args) => type === t);
    }
    static IsMessageType(type) {
        return new Proposition((msg, ...args) => type === (msg || {}).type);
    }

    static IsPrimitiveType(type) {
        return new Proposition((input, ...args) => typeof input === type);
    }
    static IsString() {
        return new Proposition((input, ...args) => typeof input === "string" || input instanceof String);
    }
    static IsNumber() {
        return new Proposition((input, ...args) => typeof input === "number");
    }
    static IsBoolean() {
        return new Proposition((input, ...args) => typeof input === "boolean");
    }
    static IsTrue() {
        return new Proposition((input, ...args) => input === true);
    }
    static IsFalse() {
        return new Proposition((input, ...args) => input === false);
    }
    static IsFunction() {
        return new Proposition((input, ...args) => typeof input === "function");
    }
    static IsArray() {
        return new Proposition((input, ...args) => Array.isArray(input));
    }
    static IsObject() {
        return new Proposition((input, ...args) => typeof input === "object");
    }
    static HasProps(...props) {
        return new Proposition((input, ...args) => typeof input === "object" && props.every(prop => prop in input));
    }

    static IsGT(num) {
        return new Proposition((no, ...args) => no > num);
    }
    static IsGTE(num) {
        return new Proposition((no, ...args) => no >= num);
    }
    static IsLT(num) {
        return new Proposition((no, ...args) => no < num);
    }
    static IsLTE(num) {
        return new Proposition((no, ...args) => no <= num);
    }
    static IsBetween(min, max) {
        return new Proposition((no, ...args) => no >= min && no <= max);
    }
};