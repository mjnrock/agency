import Registry from "./../../src/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry();

console.log(reg)

reg.register(12345, "cat", "bob");
reg.register(12345, "dog", "dan");

console.log(reg.id)

console.log(...reg);

console.warn("----- loop -----")
for(let entry of reg) {
    console.log(entry)
}

console.warn("----- obj -----")

const obj = { cat: 2 };
const uuid = reg.register(obj);

console.log(uuid)
console.log(reg)

reg.unregister(obj);

console.log(reg)

reg.register(obj);

console.log(reg)