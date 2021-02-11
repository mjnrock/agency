import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";

export default class Context extends EventEmitter {
    constructor(name, { state = {}, reducers = [], validatorss = [] } = {}) {
        super();

        this._id = uuidv4();
        this._name = name;
        this._state = state;
        this._reducers = new Set(reducers);
        this._validatorss = validatorss;

        return this;
    }

    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }

    /**
     * Add a Validator to the <Context>
     */
    attach(...validatorss) {
        for(let validators of validatorss) {
            this._validatorss.push(validators);
        }

        return this._validatorss;
    }
    /**
     * Remove a Validator from the <Context>
     */
    detach(...validatorss) {
        for(let validators of validatorss) {
            this._validatorss.delete(validators);
        }

        return this._validatorss;
    }
    /**
     * Find a Validator (if present) by @_id and return the Validator, if found
     */
    find(validatorsId) {
        for(let validators of validatorss) {
            if(validators._id === validatorsId) {
                return validators;
            }
        }
    }

    /**
     * Add a reducer function to the <Context>
     */
    add(...reducers) {
        this._reducers = new Set([
            ...this._reducers,
            ...reducers,
        ]);

        return this._reducers;
    }
    /**
     * Remove a reducer function to the <Context>
     */
    remove(...reducers) {
        for(let reducer of reducers) {
            this._reducers.delete(reducer);
        }

        return this._reducers;
    }

    /**
     * Run every Validator passings destructured @args to each.  If any |true| exists, update the state.  Because the Validators can have more logically-complex evaluators, <Context> only responds to |true|.
     */
    run(args = [], { reducerArgs = [], exclude = null } = {}) {
        for(let validators of this._validatorss) {
            const result = validators.run(...args);

            if(exclude === null || !(typeof exclude === "function" && exclude(validators, result, ...args) === true)) {
                if(result === true && this._reducers.size) {
                    for(let reducer of this._reducers) {
                        if(typeof reducer === "function") {
                            this._state = reducer(this._state, ...reducerArgs);
                        }
                    }
    
                    const txid = uuidv4();
                    this.emit("update", this._state, txid);
                    setTimeout(() => this.emit("hash", txid, hash(this._state)));

                    return true;
                }
            }
        }

        return false;
    }
};