import { v4 as uuidv4 } from "uuid";

export default class Proposition {
    static GroupLogicType = {
        CONJUNCT: 2 << 0,
        NEGATION: 2 << 1,
    };

    constructor(...evaluators) {
        super();

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
};