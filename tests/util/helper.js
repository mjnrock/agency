import { flatten, unflatten } from "./../../src/util/helper";

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
    tier1: {
        bv: 9,
        tier2: {
            tier3: {
                a: 6
            }
        },
    },
};

const flattenedObj = flatten(obj);
const flattenedArr = flatten(obj, { asArray: true });

const unflattenedObj = unflatten(flattenedObj);
const unflattenedArr = unflatten(flattenedArr);

console.log(flattenedObj);
console.log(flattenedArr);
console.log(unflattenedObj);
console.log(unflattenedArr);