import CardCollection from "./CardCollection";

export class Deck extends CardCollection {
	constructor(cards = [], players = 1) {
		super();

		this.setCards(cards);

		this.collections = new Map([
			[ "deck", new CardCollection() ],
			[ "discard", new CardCollection() ],
		]);

		for(let i = 0; i < players; i++) {
			this.collections.set(`hand-${ i }`, new CardCollection());
		}
	}

	fromCollection(collection, reassignIds = false) {
		this.empty();
		this.copyFrom(collection, reassignIds);

		return this;
	}

	static FromCollection(collection, reassignIds = false) {
		const deck = new Deck();

		return deck.fromCollection(collection, reassignIds);
	}
};

export default Deck;