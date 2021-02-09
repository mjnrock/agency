import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export default class Node extends EventEmitter {
    constructor(...evaluators) {
        this._id = uuidv4();
        this._evaluators = evaluators;
    }

    run(...args) {
        for(let evaluator of this._evaluators) {
            if(typeof evaluator === "function") {
                const result = evaluator(...args);

                if(result === true) {
                    this.emit("activate");

                    return true;
                }
            } else {
                throw new Error("@evaluator must be a function");
            }
        }

        return false;
    }
};