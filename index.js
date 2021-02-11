import Context from "./Context";
import Validator from "./Validator";
import Registry from "./Registry";
import Observer from "./Observer";

/**
 * This is the sandbox for the Context Evaluation Network
 * 
 * As a concept, the idea is simple: <Validator> are logical evaluation centers, comprised of logical proposition functions (e.g. 5 > 3, 1 !== 5, etc.)
 * The <Context> is a <Validator> grouper, allowing for the invocation of each <Validator>.  If a <Validator> returns |true|, the @reducerArgs (.run([], reducerArgs))
 *      will be passed to each reducer present in the <Context>.
 * In effect, the <Context> will update its .state if a <Validator> returns true, provided the <Validator> is not disqualified by the optional { exclude } function.
 *      In a similar way, the <Context> is also the "executor" of the <Validator>s--i.e. the <Validator> will never invoke itself, to maintain a "query-like" execution paradigm.
 */

const ctx = new Context("BuddhaTest", {
    reducers: [
        (state, args) => ({
            ...(state || {}),
            now: Date.now(),
            args
        })
    ],
    effects: [
        () => console.log(11111)
    ]
});

const val1 = new Validator(
    entry => entry == true,
    entry => entry == false,
);
const val2 = new Validator(
    entry => entry == true,
    val1
);

ctx.attach(val2);
ctx.addListener("update", console.log);
// ctx.addListener("hash", console.log);

const observer = new Observer(ctx);
observer.add(
    (...args) => console.log(`OBSERVER`, ...args),
);

const reg = new Registry();

reg.alias(val1, "cat", 1234, false);

console.log("========");
console.log(`Registry`);
console.log(reg);
console.log(reg.get(false));
console.log(reg.lookup(val1, true));
console.log("========");

/**
 * <Context>.run(...) returns a <Promise> that will resolve once all effects have executed.
 */
ctx.run([ true ], {
    reducerArgs: [ 5 ],
    exclude: (validators, result, ...args) => false
});

// console.log("========");
// console.log(`Context -> State`);
// console.log(ctx.state);
// console.log("========");