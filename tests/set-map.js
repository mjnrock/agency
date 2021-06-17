import Console from "../src/util/Console";

import AgencySet from "./../src/AgencySet";
import AgencyMap from "./../src/AgencyMap";

Console.NewContext();

const set = new AgencySet([ 11, 22, 33 ]);
const map = new AgencyMap({
	a: 11,
	b: 22,
	c: 33,
});

console.log(set.keys())
console.log(set.values())
console.log(set.entries())
console.log(set.map((k, v, i, t) => {
	return Math.random();
}, { asObject: true }));

console.log(map.keys())
console.log(map.values())
console.log(map.entries())
console.log(map.map((k, v, i, t) => {
	return [ k, Math.random() ];
}, { asObject: true, asReseed: true }));