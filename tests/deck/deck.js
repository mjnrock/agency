import Console from "./../../src/util/Console";

import Deckski from "../../src/modules/deck/package";
import Card from "../../src/modules/deck/Card";
import CardCollection from "../../src/modules/deck/CardCollection";

Console.NewContext();

const txLog = [];


const c1 = new Deckski.Card({
	name: "Kiszka",
	sex: "F",
});
const c2 = new Deckski.Card({
	name: "Buddha",
	sex: "M",
});


//	Create deck
const deck = new Deckski.Deck({
	cards: [ c1, c2, ...Card.FromSchema([
		[ {
			name: "Fuzzums",
			sex: "F",
		} ],
		[ {
			name: "Shameeka",
			sex: "F",
		} ],
		[ {
			name: "Budowski",
			sex: "M",
		} ],
		[ {
			name: "Chat",
			sex: "F",
		} ],
	]) ],
	piles: [ "cat", "dog" ],
	hooks: {
		[ Deckski.Deck.Signal.TX ]: msg => txLog.push(msg.data[ 0 ]),
	},
});

Console.h2(`Deck`);
Console.log(deck);
Console.log(deck.getCards());


// deck.move(2, "draw", "dog");
// deck.move(() = > 2, "draw", "dog");

// deck.move(~~(Math.random() * 3) + 1, "draw", "cat");
// deck.move(() => ~~(Math.random() * 3) + 1, "draw", "cat");

// deck.move(c1, "draw", "dog");
// deck.move(() => c2, "draw", "cat");

// deck.move([ c1, c2 ], "draw", "dog");
// deck.move(() => [ c1, c2 ], "draw", "cat");
// 
// deck.move(new CardCollection([ c1, c2 ]), "draw", "dog");
// deck.move(() => new CardCollection([ c1, c2 ]), "draw", "cat");


Console.open(`Piles`);
for(let name of deck.piles.keys()) {
	Console.h2(name);
	console.table(deck.piles.get(name).getCards());
}
Console.close(`Piles`);


Console.open(`Tx Log`);
console.table(txLog);
Console.close(`Tx Log`);