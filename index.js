import Context from "./Context";
import Node from "./Node";
import Registry from "./Registry";
import Observer from "./Observer";

/**
 * This is the sandbox for the Context Evaluation Network
 * 
 * As a concept, the idea is simple: <Node> are logical evaluation centers, comprised of logical proposition functions (e.g. 5 > 3, 1 !== 5, etc.)
 * The <Context> is a <Node> grouper, allowing for the invocation of each <Node>.  If a <Node> returns |true|, the @reducerArgs (.run([], reducerArgs))
 *      will be passed to each reducer present in the <Context>.
 * In effect, the <Context> will update its .state if a <Node> returns true, provided the <Node> is not disqualified by the optional { exclude } function.
 *      In a similar way, the <Context> is also the "executor" of the <Node>s--i.e. the <Node> will never invoke itself, to maintain a "query-like" execution paradigm.
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

const n1 = Node.$(
    entry => entry == true,
    entry => entry == false,
);
const n2 = Node.$(
    entry => entry == true,
    n1
);

ctx.attach(n2);
ctx.addListener("update", console.log);
// ctx.addListener("hash", console.log);

const observer = new Observer(ctx);
observer.add(
    (...args) => console.log(`OBSERVER`, ...args),
);

const reg = new Registry();

reg.alias(n1, "cat", 1234, false);

console.log("========");
console.log(`Registry`);
console.log(reg);
console.log(reg.get(false));
console.log(reg.lookup(n1, true));
console.log("========");

/**
 * <Context>.run(...) returns a <Promise> that will resolve once all effects have executed.
 */
ctx.run([ true ], {
    reducerArgs: [ 5 ],
    exclude: (node, result, ...args) => false
});

// console.log("========");
// console.log(`Context -> State`);
// console.log(ctx.state);
// console.log("========");