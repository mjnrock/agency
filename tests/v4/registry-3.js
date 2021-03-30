import Registry from "./RegistryTest";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry();

console.log(reg)

reg.register(12345, "cat", "bob");

console.log(reg)

console.warn("----- loop -----")
for(let entry of reg) {
    console.log(entry)
}