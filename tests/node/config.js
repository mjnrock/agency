import Console from "../../src/util/Console";

import Config from "../../src/node/Config";
import Entry from "../../src/node/Entry";
import Section from "../../src/node/Section";

Console.NewContext();

let children = [];
for(let i = 0; i < 5; i++) {
	children.push(new Entry(
		`text`,
		i,
		{
			scheme: /[a-zA-Z0-9]*/i,
		},
	))
}

const subsection = new Section(11, {
	children: [
		...children.slice(0, 3),
	],
});
const section = new Section(1, {
	children: [
		...children.slice(3),
		subsection,
	],
});

const config = new Config(2, {
	children: [
		section,
	],
});

console.log(config.toObject());

Console.section();

console.log(Config.FromObject(config.toObject()).toJSON(null,2));