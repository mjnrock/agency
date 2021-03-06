import Registry from "./../../Registry";

import Card from "./Card";

/**
 * Importantly, the <CardCollection> maintains **no provenance**
 * 	of any of its <Card> contents.  If a stateful-awareness of the
 * 	cards is needed, create a <Deck> from the collection.
 */
export class CardCollection extends Registry {
	constructor(cards = []) {
		super();

		if(!Array.isArray(cards)) {
			cards = [ cards ];
		}
		this.addCards(cards);
	}

	getCards() {
		const cards = [];
		for(let card of this) {
			cards.push(card);
		}

		return cards;
	}
	setCards(...cards) {
		if(Array.isArray(cards[ 0 ])) {
			cards = cards[ 0 ];
		}

		this.empty();
		for(let card of cards) {
			this.addCard(card);
		}

		return this;
	}
	
	addCard(card, ...synonyms) {
		if(card instanceof Card) {
			this.register(card, ...synonyms);
		} else if(card instanceof CardCollection) {
			card.copyTo(this, true);
		}

		return this;
	}
	addCards(addCardArgs = []) {
		for(let args of addCardArgs) {
			if(!Array.isArray(args)) {
				args = [ args ];
			}

			this.addCard(...args);
		}

		return this;
	}

	removeCard(cardOrSynonym) {
		if(cardOrSynonym instanceof Card) {
			this.unregister(cardOrSynonym);
		} else if(cardOrSynonym instanceof CardCollection) {
			for(let card of cardOrSynonym) {
				this.removeCard(card);
			}
		}

		return this;
	}
	removeCards(removeCardArgs = []) {
		for(let args of removeCardArgs) {
			if(!Array.isArray(args)) {
				args = [ args ];
			}

			this.removeCard(...args);
		}

		return this;
	}


	/**
	 * Deletes all cards from the collection
	 */
	empty() {
		for(let card of this) {
			this.removeCard(card);
		}

		return this;
	}
	/**
	 * Deletes all cards from the collection that
	 * 	qualify {{ @filterFn => true }}
	 * 
	 * Opposite of << .consume >>
	 */
	purge(filterFn) {
		if(typeof filterFn === "function") {
			for(let card of this) {
				if(filterFn(card, this) === true) {
					this.unregister(card);
				}
			}
		}

		return this;
	}
	/**
	 * Adds all cards from the collection that
	 * 	qualify {{ @includeFn => true }}
	 * 
	 * Opposite of << .purge >>
	 */
	consume(collection, includeFn, synonymFn) {
		if(collection instanceof CardColection && typeof includeFn === "function") {
			for(let card of collection) {
				if(includeFn(card, collection) === true) {
					let synonyms = [];
					if(typeof synonymFn === "function") {
						synonyms = synonymFn(card, collection, this);

						if(!Array.isArray(synonyms)) {
							synonyms = [ synonyms ];
						}
					}

					this.register(card, ...synonyms);
				}
			}
		}

		return this;
	}

	/**
	 * This creates a duplicate of the <CardCollection>
	 * 	and returns it.  By default, the cards will *not*
	 * 	receive new ids.
	 */
	duplicate(reassignIds = false) {
		const cc = new CardCollection();

		return cc.copyFrom(this, reassignIds);
	}

	copyFrom(collectionOrMap, reassignIds = false) {
		if(collectionOrMap instanceof CardCollection) {
			collectionOrMap = collectionOrMap.map;
		}

		const ccObj = [ ...collectionOrMap ].map(([ k, v ]) => {
			const newCard = k.$copy(reassignIds);

			return [
				newCard,
				v,
			];
		});

		for(let [ card, ...synonyms ] of ccObj) {
			this.addCard(card, ...synonyms);
		}

		return this;
	}
	copyTo(collection, copySynonyms = true) {
		if(collection instanceof CardCollection) {
			if(copySynonyms) {
				collection.copyFrom(this);
			} else {
				collection.addCards(this.getCards());
			}
		}

		return this;
	}

	//FIXME	Think about this more 
	// index(i) {
	// 	return [ ...this.cards ].splice(i, 1)[ 0 ];
	// }
	// take(qty = 1) {
	// 	const cards = [];
	// 	for(let i = 0; i < qty; i++) {
	// 		const index = this.order.shift();
	// 		const card = this.index(index);

	// 		cards.push(card);
	// 		this.removeCard(card);
	// 	}

	// 	if(cards.length > 1) {
	// 		return new CardCollection(cards);
	// 	}

	// 	return cards[ 0 ];
	// }

	transfer(cards = [], to, transferSynonyms = true) {
		if(!Array.isArray(cards)) {
			cards = [ cards ];
		}

		const map = this.map;
		if(to instanceof CardCollection) {
			for(let card of cards) {
				if(this.has(card)) {
					if(transferSynonyms) {
						to.addCard(card, ...map.get(card));
					} else {
						to.addCard(card);
					}

					this.removeCard(card);
				}
			}
		}
	}
	transferFrom(collection, transferSynonyms = true) {
		if(collection instanceof CardCollection) {
			collection.transferTo(this, transferSynonyms);
		}

		return this;
	}
	transferTo(collection, transferSynonyms = true) {
		if(collection instanceof CardCollection) {
			this.copyTo(collection, transferSynonyms);

			this.empty();
		}

		return this;
	}

	fromDeck(deck, { copy = true, transfer = false, reassignIds = false, synonyms = true } = {}) {
		if(copy) {
			this.copyFrom(deck.cards, reassignIds);
		} else if(transfer) {
			this.transferFrom(deck.cards, synonyms);
		}

		return this;
	}

	static FromDeck(deck, { copy = true, transfer = false, reassignIds = false, synonyms = true } = {}) {
		const collection = new CardCollection();

		if(copy) {
			collection.copyFrom(deck.cards, reassignIds);
		} else if(transfer) {
			collection.transferFrom(deck.cards, synonyms);
		}

		return collection;
	}
};

export default CardCollection;