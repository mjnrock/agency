import Context from "./Context";
import Node from "./Node";

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
    ]
});

ctx.attach(Node.$(
    entry => entry == true,
    Node.$(
        entry => entry == true,
        entry => entry == false,
    )
));

ctx.addListener("update", console.log);
// ctx.addListener("hash", console.log);

ctx.run([ true ], {
    reducerArgs: [ 5 ],
    exclude: (node, result, ...args) => false
});

console.log("========");
console.log(`State`);
console.log(ctx.state);
console.log("========");