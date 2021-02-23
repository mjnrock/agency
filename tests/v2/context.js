import Proposition, { IsBetween, IsLTE } from "../../src/v2/Proposition";
import Context from "./../../src/v2/Context";
import Observer from "./../../src/v2/Observer";

const ctx = new Context({
    rules: {
        "cats": Proposition.OR(
            IsBetween(2, 10),
            IsLTE(1),
        )
    }
});

const obs = new Observer(ctx);
obs.on("next", (...args) => console.log(`[:next] | `, ...args));
obs.on("fish", (...args) => console.log(`[:fish] | `, ...args));

ctx.fish = 2;
ctx.fish = 3;

console.log(`RESULT`, ctx.toData());