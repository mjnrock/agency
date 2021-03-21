import Registry from "./../../src/v4/Registry";

const reg = new Registry();
console.log(reg);

reg.register({ cat: 2 }, "kiszka", "buddha");
console.log(reg);

// console.log(reg.size);
// console.log(reg.values);
// console.log(reg.entries);
// console.log(reg.keys);
// console.log(reg.ids);
// console.log(reg.synonyms);

reg.unregister(reg.ids[ 0 ]);
console.log(reg);

reg.register({ cat: 2 }, "kiszka", "buddha");
reg.catssss = 435;
console.log(reg.$.toData());