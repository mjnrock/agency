import Deckski from "./../../src/modules/deck/package";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const deck1 = new Deckski.Deck({
	// cards: Deckski.Card.FromSchema(i => i, 5),
	collections: [ `hand1`, `hand2`, `hand3` ],
});

// console.log(deck1.size)
// console.log(deck1.collections.deck)

const cc = Deckski.Card.FromSchema(i => i, 5);

// console.log(cc)
// console.log(deck1.size)

deck1.addCards(cc, "deck")
deck1.createCards("deck", i => i, 5)
// console.log(deck1.size)
console.log(deck1)
console.log(``);
console.log(cc)
console.log(``);
console.log(deck1.collections.deck)

// console.log(cc.cards)