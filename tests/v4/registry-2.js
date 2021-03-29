import Registry from "../../src/v4/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry();
// reg.$.subscribe((prop, value) => console.log(prop, value))
// console.log(reg);

// let e1 = reg.register(1);
// let e2 = reg.register(2);
// let e3 = reg.register(3);

let e4 = reg.register(4, "a");
let e5 = reg.register(5, "b");
// let e6 = reg.register(6, "c");

console.log(reg.a);     // ev:  4
reg.register(7, "a");   // Synonyms ARE remappable
console.log(reg.a);     // ev:  7

// console.log(reg.$.ownKeys)
// console.log("-------------------")
// reg.unregister("a");
// reg.unregister(e5);
// console.log("-------------------")
// console.log(reg.$.ownKeys)

// console.log(reg);

// console.log("-------------------")
// console.log(reg.a);
// console.log(reg.keys);
// console.log(reg.values);
// console.log(Reflect.ownKeys(reg));
// // console.log(Object.keys(reg));
// // console.log(Object.values(reg));
// // console.log("-------------------")
// // console.log([ ...reg ]);

// console.log("-------------------")
// for(let a in reg) {
//     console.log(a);
// }
// console.log("-------------------")
// for(let a of reg) {
//     console.log(a);
// }