import Deckski from "../../src/modules/deck/package";

// console.log("-----");
console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

//	Create cards
const c1 = new Deckski.Card({
	name: "Kiszka",
	sex: "F",
});
const c2 = new Deckski.Card({
	name: "Buddha",
	sex: "M",
});
const c3 = new Deckski.Card({
	name: "Chat",
	sex: true,
});

// Validate state change, ex post
c1.color = "calico";
c2.color = "black";

// Create collection and add cards with and without synonyms
const cc = new Deckski.CardCollection([
	[ c1, "kiszka" ],
	[ c2, "buddha" ],
	c3,
]);

console.log(cc);

console.log("----- Enumerate Collection -----");

// Ensure enumeration works correctly
for(let card of cc) {
	console.log(card.id, card);
}

console.log("-----");

// Ensure aliasing works, as well as direct id match
console.log(cc.kiszka)
console.log(cc[ c2.id ])