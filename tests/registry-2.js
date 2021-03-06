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

reg.register(1, "a", "a2");
reg.register(+"2", "b");

console.log(111, reg.a)
console.log(111, reg.b)

console.log(reg);

for(let value of reg) {
    console.log(value)
}

console.log(reg.synonyms);
for(let key of reg.synonyms) {
    console.log(reg[ key ])
}

// let obj = { cat: 1 }
// reg.register(obj, "cat");

// console.log(reg.cat)
// console.log(reg[ obj ])



// const reg = new Registry();

// Registry.$.register(1, "cat");
// Registry.$.register(2, "cats.cat");
// console.log(Registry.$)
// console.log(1234, Registry.$[ "cats.cat" ]);