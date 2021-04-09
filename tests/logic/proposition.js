import Proposition from "./../../src/logic/Proposition";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const p1 = Proposition.AND(
    Proposition.AND(
        true,
        1,
    ),
    Proposition.NAND(
        true,
        1,
    ),
);

console.log(p1);
console.log(p1.test());

console.log(p1.toObject());
console.log(p1.toJson());
console.log(Proposition.FromObject(p1.toObject()));
console.log(Proposition.FromJson(p1.toJson()));