import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";
import Validator from "./Validator";

export default class Context extends EventEmitter {
    constructor(name, { state = {}, reducers = [], validators = [] } = {}) {
        super();

        this._id = uuidv4();
        this._name = name;
        this._state = state;
        this._reducers = new Set(reducers);
        this._validators = validators;

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
    attach(...validators) {
        for(let validator of validators) {
            this._validators.push(validator);
        }

        return this._validators;
    }
    /**
     * Remove a Validator from the <Context>
     */
    detach(...validators) {
        for(let validators of validators) {
            this._validators.delete(validators);
        }

        return this._validators;
    }
    /**
     * Find a Validator (if present) by @_id and return the Validator, if found
     */
    find(validatorsId) {
        for(let validators of validators) {
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
    __runOps(...args) {
        for(let reducer of this._reducers) {
            if(typeof reducer === "function") {
                this._state = reducer(this._state, ...args);
            }
        }

        const txid = uuidv4();
        this.emit("update", this._state, txid);
        setTimeout(() => this.emit("hash", txid, hash(this._state)));
    }
    attempt(validator, ...args) {
        if(validator instanceof Validator && validator.run(...args) === true) {
            this.__runOps(...args);

            return true;
        }

        return false;
    }
    run({ exclude = null, allowVacuous = false } = {}, ...args) {
        if(this._validators.length === 0 && allowVacuous === true) {
            this.__runOps(...args);

            return true;
        }

        for(let validator of this._validators) {
            //? If a <Validator> is "attached", pass it the current state
            const result = validator.run(this._state, ...args);

            if(exclude === null || !(typeof exclude === "function" && exclude(validator, result, ...args) === true)) {
                if(result === true && this._reducers.size) {
                    this.__runOps(...args);

                    return true;
                }
            }
        }

        return false;
    }
};