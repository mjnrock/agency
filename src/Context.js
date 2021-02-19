import EventEmitter from "events";
import { type } from "os";
import { v4 as uuidv4 } from "uuid";
import Mutator from "./Mutator";
import Proposition from "./Proposition";

/**
 * :update | (state, isMutatorUpdate)
 *      Non-Mutator updates occur if state is set directly (i.e. state[ prop ] = value)
 */

export default class Context extends EventEmitter {
    /**
     * OVERLOADS
     * (state = {}, evaluators = [ ...[ <Mutator>|fn, ...Array<<Proposition>|fn> ] ])
     * (state = {}, <Mutator>|fn)
     */
    constructor(state = {}, evaluators = []) {
        super();

        this._id = uuidv4();
        this._state = state;
        this._evaluators = new Map();

        if (typeof evaluators === "function" || evaluators instanceof Mutator) {
            this.attach(evaluators);
        } else {
            for (let [ mutator, ...propositions ] of evaluators) {
                this.attach(mutator, ...propositions);
            }
        }

        return new Proxy(this, {
            get: function (target, prop, receiver) {
                if (prop in (target._state || {})) {
                    return target._state[ prop ];
                }

                return Reflect.get(...arguments);
            },
            set(target, prop, value) {
                if (prop in (target._state || {})) {
                    target._state[ prop ] = value;
                    
                    target.emit("update", target._state, false);
                }
                
                return Reflect.set(...arguments);
            }
        });
    }

    get state() {
        return { ...this._state };
    }

    attach(mutator, ...propositions) {
        if (Array.isArray(mutator)) {
            if (mutator.every(m => typeof m === "function")) {
                mutator = new Mutator(...mutator);
            } else {
                throw new Error("@mutator as an <Array> may only contain |function|");
            }
        } else if (typeof mutator === "function") {
            mutator = new Mutator(mutator);
        }

        if (!(mutator instanceof Mutator)) {
            throw new Error("@mutator must be a <Mutator>, a |function|, or Array<function>");
        }

        if (propositions.length === 1) {
            if (propositions[ 0 ] instanceof Proposition) {
                this._evaluators.set(mutator, [ propositions[ 0 ] ]);
            } else if (typeof propositions[ 0 ] === "function") {
                this._evaluators.set(mutator, [ new Proposition(propositions[ 0 ]) ]);
            } else {
                throw new Error("All @propositions must be either a <Proposition> or a |function|");
            }
        } else {
            let props = [];
            for (let proposition of propositions) {
                if (proposition instanceof Proposition) {
                    props.push(proposition);
                } else if (typeof proposition === "function") {
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

    //  Convenience function if using this with React
    //  Accounts for a direct type, or the type being nested within a message object
    attachTyped(type, fn) {
        return this.attach(fn, new Proposition(
            Proposition.IsType(type),
            Proposition.IsMessageType(type)
        ));
    }

    // <Context> is vacuously true, if no propositions are connected to a given <Mutator>
    // In the case where @args looks like a Redux message (object with "type"), add it to the mutator params
    run(args = [], ...mutatorArgs) {
        let mutArgs = mutatorArgs;
        if (!Array.isArray(args)) {
            if(typeof args === "object" && "type" in args) {
                mutArgs = [
                    args,
                    ...mutArgs
                ];
            }

            args = [ args ];
        }

        let tests = [];
        for (let [ mutator, props ] of this._evaluators.entries()) {
            if (props.length === 0 || props.every(prop => prop.run(...args) === true)) {
                this._state = mutator.mutate(this._state, ...mutArgs);

                tests.push(true);
            } else {
                tests.push(false);
            }
        }

        this.emit("update", this._state, true);

        return tests.some(t => t === true);
    }

    static IdDecorator(entry) {
        if (typeof entry === "object") {
            if (!("_id" in entry)) {
                entry._id = uuidv4();

                return entry;
            }
        } else if (entry !== void 0) {
            return {
                _id: uuidv4(),
                _value: entry,
                _assigned: Date.now(),
            };
        }

        return false;
    }
};

//* Synonymous Usage Examples
// //* Ex. 1
// const ctx = new Context({
//     cats: 2,
// }, [
//     [
//         state => ({
//             ...state,
//             _now: Date.now(),
//         }),
//         (...args) => {
//             console.log(...args);

//             return true;
//         }
//     ]
// ]);

// //* Ex. 2
// const ctx = new Context({
//     cats: 2,
// });
// ctx.attach(
//     state => ({
//         ...state,
//         _now: Date.now(),
//     }),
//     (...args) => {
//         console.log(...args);

//         return true;
//     }
// );

// //* Ex. 3
// const ctx = new Context({
//     cats: 2,
// });
// ctx.attach(
//     new Mutator(state => ({
//         ...state,
//         _now: Date.now(),
//     })),
//     new Proposition((...args) => {
//         console.log(...args);

//         return true;
//     })
// );