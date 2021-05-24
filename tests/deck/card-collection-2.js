import Console from "../helper";

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


//	Create deck
const deck = new Deckski.Deck();

Console.log(deck.fromCollection(cc))