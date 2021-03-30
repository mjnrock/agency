import EventEmitter from "events";
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
                if (prop in (target || {})) {
                    return target[ prop ];
                } else if (prop in (target._state || {})) {
                    return target._state[ prop ];
                }

                return Reflect.get(...arguments);
            },
            set(target, prop, value) {
                if (prop in (target || {})) {
                    target[ prop ] = value;

                    return target;
                } else if (prop in (target._state || {})) {
                    target._state[ prop ] = value;
                    
                    target.emit("update", target._state, [ false, prop, value ]);

                    return target;
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

        this.emit("update", this._state, [ true, ...mutArgs ]);    // @mutArgs passed in case <Observer> needs something (e.g. a React message type)

        return tests.some(t => t === true);
    }

    //  ============== BEGIN REACT CONVENIENCE METHODS =================
    //! These are named according to their React convenience functionality, and thus are NOT named consistently with <Context> terms
    //?  A singleton pattern on <Context> descendent(s) should be used when using this with React (e.g. Game::Context ---> Game.Instance/Game.$)
    //      This will allow for easy invocation of .dispatch and .addReducer
    //?  If an "effect" is needed, invoke an <Observer> and .watch the <Context> to respond to updates (e.g. const obs = new Observer(Game.$, console.log))
    /**
     * This mutator will activate if a <String> @type matches OR if an object containing a matching "type" prop (e.g. { type: @type, ... })
     */
    addReducer(type, fn) {
        return this.attach(fn, new Proposition(
            Proposition.IsType(type),
            Proposition.IsMessageType(type)
        ));
    }
    /**
     * OVERLOADS
     * (type, data, ...args) | The type-data paradigm
     * ({ type, data, ... }, ...args) | The message-/event-object paradigm
     */
    dispatch(...args) {
        if(typeof args[ 0 ] === "string" || args[ 0 ] instanceof String) {
            return this.run([ args[ 0 ] ], { type: args[ 0 ], data: args[ 1 ] }, ...args.slice(2));
        } else if(typeof args[ 0 ] === "object") {
            return this.run([ args[ 0 ], ], ...args);
        }

        return false;
    }

    //  ============== END REACT CONVENIENCE METHODS =================
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