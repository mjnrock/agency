import Registry from "../../src/v4/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry();
// reg.$.subscribe((prop, value) => console.log(prop, value))
console.log(reg);

reg.register(1);
reg.register(2);
reg.register(3);

reg.register(4, "a");
reg.register(5, "b");
reg.register(6, "c");

console.log(reg);

console.log("-------------------")
console.log(reg.a);
console.log(reg.keys);
console.log(reg.values);
console.log(Reflect.ownKeys(reg));
// console.log(Object.keys(reg));
// console.log(Object.values(reg));
// console.log("-------------------")
// console.log([ ...reg ]);

console.log("-------------------")
for(let a in reg) {
    console.log(a);
}
console.log("-------------------")
for(let a of reg) {
    console.log(a);
}