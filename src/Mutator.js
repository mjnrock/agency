import { v4 as uuidv4 } from "uuid";

export default class Mutator {
    constructor(...sequence) {
        this._id = uuidv4();
        this._sequence = sequence;
    }

    add(sorter, ...fns) {
        if(!fns.every(fn => typeof fn === "function")) {
            throw new Error("All @fns must be of type |function|");
        }

        this._evaluators = sorter([
            ...this._evaluators,
            ...fns,
        ]);

        return this;
    }
    remove(sorter, ...fns) {
        for(let fn of fns) {
            if(typeof fn !== "function") {
                throw new Error("All @fns must be of type |function|");
            }

            this._evaluators = this._evaluators.filter(e => e !== fn);
        }

        this._evaluators = sorter(this._evaluators);

        return this;
    }

    mutate(state = {}, ...args) {
        for(let fn of this._sequence) {
            state = fn(state, ...args);
        }

        return state;
    }
};