import Proposition, { IsBetween, IsLTE } from "../../src/v2/Proposition";
import Context from "./../../src/v2/Context";
import Observer from "./../../src/v2/Observer";

const ctx = new Context();

const obs = new Observer(ctx);
obs.on("next", console.log);

ctx.__add("cats", Proposition.OR(
    IsBetween(2, 10),
    IsLTE(1),
));

ctx.fish = 2;
ctx.fish = 3;

console.log(`RESULT`, ctx.toData());