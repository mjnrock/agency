import Registry from "./../../src/util/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry();

console.log(reg)

reg.register(12345, "cat", "bob");
reg.register(12345, "dog", "dan");

console.log(reg.id)

console.log(...registry);

console.warn("----- loop -----")
for(let entry of reg) {
    console.log(entry)
}