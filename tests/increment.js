import Context from "../Context";
import Validator from "../Validator";
import Registry from "../Registry";
import Observer from "../Observer";

const reg = new Registry();
reg.alias(new Validator(
    (state) => Date.now() > state.lastTimestamp - 50,
), "Incrementor");

const ctx = new Context({
    lastTimestamp: Date.now(),
    count: 0,
}, [
    (state, validatorId) => {
        if(validatorId === reg.getId("Incrementor")) {
            return ({
                lastTimestamp: Date.now(),
                count: state.count + 1,
            })
        }
    },
]);
const obs = new Observer(ctx, console.log);

// //! Unattached execution (<Context.state> is not natively passed to unattached executions)
ctx.attempt(reg.get("Incrementor"), ctx.state);
ctx.attempt(reg.get("Incrementor"), ctx.state);
console.warn(`[Test]: Expected - ${ 2 } | Actual - ${ ctx.state.count }`);

// //! Attached execution
// ctx.attach(reg.get("Incrementor"));
// ctx.run();
// ctx.run();
// console.info(`[Test]: Expected - ${ 4 } | Actual - ${ ctx.state.count }`);