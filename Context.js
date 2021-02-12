import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import Mutator from "./Mutator";
import Proposition from "./Proposition";

export default class Context extends EventEmitter {
    constructor(state = {}, evaluators = []) {
        super();

        this._id = uuidv4();
        this._state = state;
        this._evaluators = new Map();

        for(let [ mutator, propositions ] of evaluators) {
            this.attach(mutator, ...propositions);
        }
    }

    get state() {
        return JSON.parse(JSON.stringify(this._state));
    }

    attach(mutator, ...propositions) {
        if(Array.isArray(mutator)) {
            if(mutator.every(m => typeof m === "function")) {
                mutator = new Mutator(...mutator);
            } else {
                throw new Error("@mutator as an <Array> may only contain |function|");
            }
        } else if(typeof mutator === "function") {
            mutator = new Mutator(mutator);
        }
        
        if(!(mutator instanceof Mutator)) {
            throw new Error("@mutator must be a <Mutator>, a |function|, or Array<function>");
        }

        if(propositions.length === 1) {
            if(propositions[ 0 ] instanceof Proposition) {
                this._evaluators.set(mutator, [ propositions[ 0 ] ]);
            } else if(typeof propositions[ 0 ] === "function") {
                this._evaluators.set(mutator, [ new Proposition(propositions[ 0 ]) ]);
            } else {
                throw new Error("All @propositions must be either a <Proposition> or a |function|");
            }
        } else {
            let props = [];
            for(let proposition of propositions) {
                if(proposition instanceof Proposition) {
                    props.push(proposition);
                } else if(typeof proposition === "function") {
                    props.push(new Proposition(proposition));
                } else {
                    throw new Error("All @propositions must be either a <Proposition> or a |function|");
                }
            }

            this._evaluators.set(mutator, props);
        }

        return mutator;
    }
    detach(mutator) {
        return this._evaluators.delete(mutator);
    }

    run(...args) {
        for(let [ mutator, props ] of this._evaluators.entries()) {
            if(props.every(prop => prop.run(...args) === true)) {
                this._state = mutator.mutate(this._state);
            } else {
                return;
            }
        }
    }
};