import Proposition from "../../src/logic/Proposition";
import Implication from "../../src/logic/Implication";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const p1 = Proposition.OR(
    Proposition.AND(
        true,
        1,
    ),
);
const c1 = new Implication(
    p1,
    () => {
        console.log("Hello")
        return 984329;
    }
);

console.log(c1.test());
console.log(c1.attempt());

console.log(c1.toObject());
console.log(c1.toJson());
console.log(Implication.FromObject(c1.toObject()).test());
console.log(Implication.FromJson(c1.toJson()).attempt());