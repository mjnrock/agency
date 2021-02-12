import Proposition from "../Proposition";
import Mutator from "../Mutator";
import Context from "../Context";
import Observer from "../Observer";

const ctx = new Context({
    cats: 2,
}, [
    [
        state => ({
            ...state,
            _now: Date.now(),
        }),
        (...args) => {
            console.log(`[PROPOSITION]`, ...args);

            return true;
        }
    ]
]);

const obs = new Observer(ctx, (...args) => console.log(`[OBSERVER]`, ...args));

ctx.run(1, "fish");
console.log(`[.]`, ctx.state);