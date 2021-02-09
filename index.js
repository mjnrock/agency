import Context from "./Context";
import Node from "./Node";

const ctx = new Context("BuddhaTest", {
    reducers: [
        state => ({
            ...(state || {}),
            now: Date.now(),
        })
    ]
});

ctx.attach(Node.$(
    entry => entry === true,
    Node.$(
        entry => entry === true,
        entry => entry === false,
    )
));

ctx.addListener("update", console.log);
// ctx.addListener("hash", console.log);

ctx.run(true)

console.log(ctx.state);