import Registry from "../src/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const reg = new Registry({
    Registry: {
        typed: (prop, value, current) => {
            console.log(222, prop, value, current);

            return typeof value === "number";
        },
    }
});

// console.log(reg);

reg.register(1, "a");
reg.register("2", "b");

console.log(111, reg.a)
console.log(111, reg.b)





// const reg = new Registry();

// Registry.$.register(1, "cat");
// Registry.$.register(2, "cats.cat");
// console.log(Registry.$)
// console.log(1234, Registry.$[ "cats.cat" ]);