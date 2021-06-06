import Console from "./../helper";

import Deckski from "../../src/modules/deck/package";

Console.NewContext();

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

Console.log(cc);

Console.h1(`Enumerate Collection`);

// Ensure enumeration works correctly
for(let card of cc) {
	Console.log(card.id, card);
}

Console.hr();
Console.log(cc._entries);
Console.hr();

// Ensure aliasing works, as well as direct id match
Console.log(cc.kiszka)
Console.log(cc[ c2.id ])

Console.h1(`Copy Collection`);

Console.log(cc)
Console.hr();
Console.log(cc.createCopy())
Console.hr();
Console.log(cc.createCopy(true))