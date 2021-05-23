import Registry from "./../../Registry";

import Card from "./Card";
import Deck from "./Deck";

export class CardCollection extends Registry {
	constructor({ cards = [], maxSize = Infinity, minSize = -Infinity, deck } = {}) {
		super();
		
		this._deck = deck;
		this._cards = new Set(cards);
		
		this._config = {
			maxSize,
			minSize,
		};

		this.add(...cards)
	}

	get deck() {
		return this.state._deck;
	}
	set deck(deck) {
		this.state._deck = deck;

		for(let card of this.cards) {
			card.deck = deck;
		}
	}

	get config() {
		return this.state._config;
	}

	get cards() {
		return [ ...this.state._cards ];
	}
	set cards(cards) {
		this.state._cards = new Set();
		this.add(...cards.slice(0, this.state._config.maxSize));
	}

	add(...cards) {
		for(let card of cards) {
			if(this.size >= this.config.maxSize) {
				return false;
			}

			if(card instanceof CardCollection) {
				this.add(...card.cards);
			} else if(card instanceof Card) {
				card._deck = this._deck;

				this._cards.add(card);
				this.register(card);
			}
		}

		return true;
	}
	remove(...cards) {
		for(let card of cards) {
			if(this.size <= this.config.minSize) {
				return false;
			}

			if(card instanceof CardCollection) {
				this.remove(...card.cards);
			} else if(card instanceof Card) {
				card._deck = null;
				
				this._cards.delete(card);
				this.unregister(card);
			}
		}

		return true;
	}

	moveTo(deckOrCardCollection) {
		if(deckOrCardCollection instanceof Deck) {
			deckOrCardCollection.addCards(this.cards);

			return true;
		} else if(deckOrCardCollection instanceof CardCollection) {
			deckOrCardCollection.add(...this.cards)
			this.empty();

			return true;
		}

		return false;
	}

	/**
	 * Conjunctive test, if more than one (1) <Card> is passed
	 */
	has(...cards) {
		let results = [];
		for(let card of cards) {
			if(card instanceof CardCollection) {
				results.push(this._cards.has(...card.cards));
			} else if(card instanceof Card) {
				results.push(this._cards.has(card));
			}
		}

		if(cards.length > 1) {
			return results.every(v => v === true);
		}

		return results[ 0 ];
	}
	
	get size() {
		return this.state._cards.size;
	}

	get isEmpty() {
		return !this.state._cards.size;
	}
	empty() {
		this._cards = new Set();
	}
};

export default CardCollection;