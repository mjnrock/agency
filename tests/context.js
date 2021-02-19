import Proposition from "../src/Proposition";
import Context from "../src/Context";
import Observer from "../src/Observer";

// const ctx = new Context({
//     cats: 2,
// }, [
//     [
//         state => ({
//             ...state,
//             _now: Date.now(),
//         }),
//         Proposition.IsType("cat"),
//     ]
// ]);

// const obs = new Observer(ctx, (...args) => console.log(`[OBSERVER]`, ...args));

// ctx.run("cat");
// console.log(`[.]`, ctx.state);
// console.log(ctx.cats)