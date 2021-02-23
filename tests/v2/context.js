import Proposition, { IsBetween, IsLTE, IsObject } from "../../src/v2/Proposition";
import Context from "./../../src/v2/Context";
import Observer from "./../../src/v2/Observer";

const obj = {
    cats: 2,
};

const ctx = new Context({
    rules: {
        "fish": Proposition.OR(
            IsBetween(2, 10),
            IsObject(),
        ),
    },
    refs: {
        "CATS": obj,
    },
    parentRule: true,
});

const obs = new Observer(ctx);
// obs.on("next", (...args) => console.log(`[:next] | `, ...args));
// obs.on("fish", (...args) => console.log(`[:fish] | `, ...args));

obj.cats = 14;
ctx.fish = 3;
ctx.fish = {
    a: 1,
    b: 2,
};

console.log(`RESULT`, ctx.toData());

// console.log(Proposition.NAND(
//     IsBetween(2, 10),
//     IsLTE(1),
// ).isNand)