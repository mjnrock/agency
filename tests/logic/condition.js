import Proposition from "../../src/logic/Proposition";
import Condition from "../../src/logic/Condition";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const p1 = Proposition.OR(
    Proposition.AND(
        true,
        1,
    ),
);
const c1 = new Condition(
    p1,
    () => {
        console.log("Hello")
        return 984329;
    }
);

console.log(c1.test());
console.log(c1.test([],[],{ returnResult: true }));

console.log(c1.toObject());
console.log(c1.toJson());
console.log(Condition.FromObject(c1.toObject()).test());
console.log(Condition.FromJson(c1.toJson()).test([],[],{ returnResult: true }));