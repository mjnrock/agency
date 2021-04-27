import Predicate from "../../src/logic/Predicate";
import Proposition from "../../src/logic/Proposition";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const obj1 = {
    cat: true,
};
const obj2 = {
    cat: false,
};

const isACat = new Predicate(obj => obj.cat === true);

console.log(isACat.test(obj1));
console.log(isACat.test(obj2));

console.log(Proposition.OR(isACat).test(obj1));
console.log(Proposition.OR(isACat).test(obj2));
console.log(Proposition.NOT(isACat).test(obj1));
console.log(Proposition.NOT(isACat).test(obj2));