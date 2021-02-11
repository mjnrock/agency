import Context from "../Context";
import Validator from "../Validator";
import Registry from "../Registry";
import Observer from "../Observer";

const ctx = new Context("Numbers", {
    state: {
        lastTimestamp: Date.now(),
        count: 0,
    },
    reducers: [
        (state) => ({
            lastTimestamp: Date.now(),
            count: state.count + 1,
        }),
    ]
});
const obs = new Observer(ctx, console.log);

const val1 = new Validator(
    (state) => Date.now() > state.lastTimestamp - 50,
);

//! Unattached execution (<Context.state> is not natively passed to unattached executions)
ctx.attempt(val1, ctx.state);
ctx.attempt(val1, ctx.state);
ctx.attempt(val1, ctx.state);
ctx.attempt(val1, ctx.state);

//! Attached execution
ctx.attach(val1);
ctx.run();
ctx.run();
ctx.run();
ctx.run();