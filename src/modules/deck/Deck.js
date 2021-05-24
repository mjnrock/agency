import CardCollection from "./CardCollection";

/**
 * ### README
 * 
 * The <Deck> is a <Card> aggregator that maintains a
 * 	provenance-awareness of every <Card> that it contains.
 * 	As play progresses, <Card(s)> are transferred to piles
 * 	within the deck, and the master registry (the <Deck> class
 * 	itself), keep reference to which <Card(s)> are where.
 * 
 * As the <Deck> expects game play, it also expects a player count.
 * 	Each player is given a "hand-#", which internally is a pile.
 * 	While the <Deck> contains piles for the players, the data should
 * 	primarily be read externally, and manipulated internally.
 * 
 * The <Deck> should be used as a light-weight source-of-truth,
 * 	and the actual game should simply reference and abstract data
 * 	from the <Deck> class.
 */
export class Deck extends CardCollection {
	constructor(cards = [], players = 1) {
		super();

		this.setCards(cards);	// "Card Dictionary"

		this.piles = new Map([
			[ "draw", new CardCollection() ],
			[ "discard", new CardCollection() ],
		]);

		for(let i = 0; i < players; i++) {
			this.piles.set(`hand-${ i + 1 }`, new CardCollection());
		}
	}

	
	/**
	 * @param {Card[]|CardCollection|int|fn} cards | The `fn` must return one of the @card types, *except* another function (i.e. single-tier evaluation)
	 */
	move(cards = [], from, to) {
		//FIXME	Account for all the @card variants and move accordingly

		const fromPile = this.piles.get(from);
		const toPile = this.piles.get(to);

		if(fromPile instanceof CardCollection && toPile instanceof CardCollection) {
			//TODO Perform transfer

			//?	Create a transaction log for provenance and verifiability/lookup

			return true;
		}

		return false;
	}
	draw(cards = [], to, from = "draw") {
		return this.move(cards, from, to);
	}
	discard(cards = [], from, to = "discard") {
		return this.move(cards, from, to);
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