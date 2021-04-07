import Registry from "../src/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry();

Registry.$.register(1, "cat");
Registry.$.register(2, "cats.cat");
console.log(Registry.$)
console.log(1234, Registry.$[ "cats.cat" ]);