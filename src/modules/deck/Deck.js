import { $Dispatchable } from "./../../event/Channel";
import { compose } from "../../util/helper";

import Card from "./Card";
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
export class Deck extends compose($Dispatchable)(CardCollection) {
	static Signal = {
		TX: "Deck.Transaction",
	};

	constructor({ cards = [], piles = [], hooks = {} } = {}) {
		super({
			Dispatchable: {
				hooks,
			},
		});

		this.setCards(cards);	// "Card Dictionary"

		this.piles = new Map([
			[ "draw", new CardCollection(this.getCards()) ],
			[ "discard", new CardCollection() ],
		]);

		for(let pile of piles) {
			this.piles.set(pile, new CardCollection());
		}
	}

	//FIXME	Figure out paradigm for ordering
	
	_interpretCards(cards) {
		if(typeof cards === "number") {
			return cards;
		} else if(cards instanceof Card) {
			return cards;
		} else if(cards instanceof CardCollection) {
			return cards.getCards();
		} else if(Array.isArray(cards)) {
			let cardList = [];
			for(let card of cards) {
				cardList.push(this._interpretCards(card));
			}

			return cardList;
		} else if(typeof cards === "function") {
			return this._interpretCards(cards(this));
		}

		return [];
	}
	/**
	 * @param {Card[]|CardCollection|int|fn} cards | The `fn` must return one of the @card types, *except* another function (i.e. single-tier evaluation)
	 */
	move(cards = [], from, to) {
		const fromPile = this.piles.get(from);
		const toPile = this.piles.get(to);

		let cardList = this._interpretCards(cards);

		if(typeof cardList === "number") {
			cardList = [ ...fromPile ].slice(0, cardList);
		}

		if(fromPile instanceof CardCollection && toPile instanceof CardCollection) {
			fromPile.transfer(cardList, toPile, true);

			this.dispatch(Deck.Signal.TX, { from, to, cards });

			return true;
		}

		return false;
	}
	draw(cards = [], to) {
		return this.move(cards, "draw", to);
	}
	discard(cards = [], from) {
		return this.move(cards, from, "discard");
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