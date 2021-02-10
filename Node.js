import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export default class Node extends EventEmitter {
    static LogicalType = {
        CONJUNCT: 2 << 0,
        NEGATION: 2 << 1,
    };
    
    constructor(...evaluators) {
        super();

        this._id = uuidv4();
        this._evaluators = evaluators;        
        this._mask = 0;

        if(typeof evaluators[ 0 ] === "number") {
            this._mask = evaluators[ 0 ];
            this._evaluators = evaluators.slice(1);
        }
    }

    /**
     * Iterate over every evalulator and execute passings destructured @args
     * @param  {...any} args 
     */
    run(...args) {
        let result = (this._mask & Node.LogicalType.CONJUNCT) === Node.LogicalType.CONJUNCT;
        console.log(this._mask, Node.LogicalType, this._mask & Node.LogicalType.CONJUNCT)

        for(let evaluator of this._evaluators) {
            let res = false;

            if(typeof evaluator === "function") {
                res = evaluator(...args);
            } else if(evaluator instanceof Node) {
                res = evaluator.run(...args);
            } else {
                throw new Error("@evaluator must be a function");
            }

            if((this._mask & Node.LogicalType.CONJUNCT) === Node.LogicalType.CONJUNCT) {
                result = result && res;
            } else {
                result = result || res;
            }
        }

        if((this._mask & Node.LogicalType.NEGATION) === Node.LogicalType.NEGATION) {
            result = !result;
        }

        if(result === true) {
            this.emit("activate");

            return true;
        }

        return false;
    }

    /* STATIC HELPER FUNCTIONS */
    static $(...evaluators) {
        if(typeof evaluators[ 0 ] === "boolean" && evaluators[ 0 ] === true) {
            return Node.$(...evaluators.slice(1)).negation();
        }

        return new Node(...evaluators);
    }
    static Conjuct(...evaluators) {
        if(typeof evaluators[ 0 ] === "boolean" && evaluators[ 0 ] === true) {
            return Node.$(...evaluators.slice(1)).conjunct().negation();
        }

        return Node.$(...evaluators).conjunct();
    }
    static Dysjunct(...evaluators) {
        if(typeof evaluators[ 0 ] === "boolean" && evaluators[ 0 ] === true) {
            return Node.$(...evaluators.slice(1)).dysjunct().negation();
        }

        return Node.$(...evaluators).dysjunct();
    }
};