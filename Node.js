import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

/**
 * ? <Node>
 * 
 */
export default class Node extends EventEmitter {
    constructor(...evaluators) {
        super();

        this._id = uuidv4();
        this._evaluators = evaluators;        
        this._isConjunctive = false;
        this._isNegation = false;
    }

    /* LOGICAL MANIPULATION FLAGS */
    negation() {
        this._isNegation = true;

        return this;
    }
    affirmative() {
        this._isNegation = false;

        return this;
    }

    dysjunct() {
        this._isConjunctive = false;

        return this;
    }
    conjunct() {
        this._isConjunctive = true;

        return this;
    }

    /**
     * Iterate over every evalulator and execute passings destructured @args
     * @param  {...any} args 
     */
    run(...args) {
        if(this._isConjunctive === true) {
            let result = true;

            for(let evaluator of this._evaluators) {
                if(typeof evaluator === "function") {
                    result = result && evaluator(...args);
                } else {
                    throw new Error("@evaluator must be a function");
                }
            }

            if(this._isNegation) {
                result = !result;
            }
    
            if(result === true) {
                this.emit("activate");

                return true;
            }

            return false;
        }

        for(let evaluator of this._evaluators) {
            if(typeof evaluator === "function") {
                let result = evaluator(...args);

                if(this._isNegation) {
                    result = !result;
                }

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