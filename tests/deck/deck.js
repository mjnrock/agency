import Console from "./../../src/util/Console";

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


//	Create card collection
const cc = new Deckski.CardCollection([
	[ c1, "kiszka" ],
	[ c2, "buddha" ],
]);


const txLog = [];

//	Create deck
const deck = new Deckski.Deck({
	cards: cc,
	piles: [ "cat", "dog" ],
	hooks: {
		"**": msg => txLog.push(msg.data[ 0 ]),
	},
});

Console.log(deck.getCards());

Console.open(`Piles`);

Console.log("draw", deck.piles.get("draw").getCards());
Console.log("discard", deck.piles.get("discard").getCards());
Console.log("cat", deck.piles.get("cat").getCards());
Console.log("dog", deck.piles.get("dog").getCards());

deck.move(1, "draw", "cat");

Console.h2(`Piles`);
Console.log("draw", deck.piles.get("draw").getCards());
Console.log("discard", deck.piles.get("discard").getCards());
Console.log("cat", deck.piles.get("cat").getCards());
Console.log("dog", deck.piles.get("dog").getCards());

Console.close(`Piles`);

Console.h2(`Transaction Log`);
console.table(txLog);