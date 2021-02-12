import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export default class Validator extends EventEmitter {
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
        let result = (this._mask & Validator.LogicalType.CONJUNCT) === Validator.LogicalType.CONJUNCT;

        for(let evaluator of this._evaluators) {
            let res = false;

            if(typeof evaluator === "function") {
                res = evaluator(...args);
            } else if(evaluator instanceof Validator) {
                res = evaluator.run(...args);
            } else {
                throw new Error("@evaluator must be a function");
            }

            if((this._mask & Validator.LogicalType.CONJUNCT) === Validator.LogicalType.CONJUNCT) {
                result = result && res;
            } else {
                result = result || res;
            }
        }

        if((this._mask & Validator.LogicalType.NEGATION) === Validator.LogicalType.NEGATION) {
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
            return Validator.$(...evaluators.slice(1)).negation();
        }

        return new Validator(...evaluators);
    }
    static Conjuct(...evaluators) {
        if(typeof evaluators[ 0 ] === "boolean" && evaluators[ 0 ] === true) {
            return Validator.$(...evaluators.slice(1)).conjunct().negation();
        }

        return Validator.$(...evaluators).conjunct();
    }
    static Dysjunct(...evaluators) {
        if(typeof evaluators[ 0 ] === "boolean" && evaluators[ 0 ] === true) {
            return Validator.$(...evaluators.slice(1)).dysjunct().negation();
        }

        return Validator.$(...evaluators).dysjunct();
    }
};