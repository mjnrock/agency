import Network from "./../../src/event/Network";
import Watchable from "./../../src/event/Watchable";
import Deckski from "./../../src/modules/deck/package";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

// const deck1 = new Deckski.Deck({
// 	// cards: Deckski.Card.FromSchema(i => i, 5),
// 	collections: [ `hand1`, `hand2`, `hand3` ],
// });

// // console.log(deck1.size)
// // console.log(deck1.collections.deck)

// const cc = Deckski.Card.FromSchema(i => i, 5);

// console.log(cc)
// console.log(deck1.size)

// deck1.addCards(cc, "deck")
// deck1.createCards("deck", i => i, 5)
// console.log(deck1.size)
// console.log(deck1)

const n = new Network()
const w = new Watchable(n, {
	cat: () => Math.random(),
	dog: 1,
});

// console.log(w)
// console.log(Watchable.Generate(n, w, { isStateSchema: true }))
console.log(w.toJson())
console.log(w.toObject())
console.log(w.toJson(false))
console.log(w.toObject(false))