import Console from "../../src/util/Console";

import Entry from "../../src/node/Entry";

Console.NewContext();

const entry = new Entry("text", "Cats!", {
	readOnly: true,
	options: {
		one: "Buddha",
		two: "Kiszka",
	},
});

console.log(entry);

entry.setByKey(0)
entry.data = "Buddha";
entry.meta.isReadOnly = false
entry.setByKey("two")

console.log(entry.data);

// console.log(entry);