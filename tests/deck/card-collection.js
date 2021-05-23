import Deckski from "../../src/modules/deck/package";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const c1 = new Deckski.Card({
	name: "Kiszka",
	sex: "F",
});
const c2 = new Deckski.Card({
	name: "Buddha",
	sex: "M",
});

c1.color = "calico";
c2.color = "black";

const cc = new Deckski.CardCollection([
	c1,
	c2,
]);

console.log(cc);