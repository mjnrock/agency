import CardCollection from "./CardCollection";

export class Deck extends CardCollection {
	constructor(cards = []) {
		super();

		this.setCards(cards);
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