import Registry from "../src/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry();

Registry.$.register(1, "cat");
Registry.$.register(2, "cats");
console.log(Registry.$)