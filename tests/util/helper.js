import { flatten } from "./../../src/util/helper";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const obj = {
    level1: {
        level2: {
            cat: 5,
            dog: 7,
        },
        yeah: "k",
    },
    cheese: "fish",
};

console.log(flatten(obj))
console.log(flatten(obj, { asArray: true }));