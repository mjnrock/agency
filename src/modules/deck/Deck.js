import AgencyBase from "./../../AgencyBase";

import Card from "./Card";
import CardCollection from "./CardCollection";

export class Deck extends AgencyBase {
	constructor({ cards = [], shuffle = false, collections = [] } = {}) {
		super();

		this.cards = new Set();
		this.collections = {
			deck: new CardCollection({ deck: this }),
			discard: new CardCollection({ deck: this }),
		};

		this.addCards(cards, "deck");
		this.addCollections(collections);

		for(let i = 0; i < +shuffle; i++) {
			this.shuffle();
		}
	}

    [ Symbol.iterator ]() {
        var index = -1;
        var data = Object.entries(this.collections);

        return {
            next: () => ({ value: data[ ++index ], done: !(index in data) })
        };
    }

	get remaining() {
		return this.collections.deck.size;
	}
	get discarded() {
		return this.collections.discard.size;
	}

	get size() {
		return this.cards.size;
	}

	addCollections(...collections) {
		if(Array.isArray(collections[ 0 ])) {
			this.collections = {
				...this.collections,
				...Object.fromEntries(collections[ 0 ].map(name => [ name, new CardCollection({ deck: this }) ])),
			};
		} else if(typeof collections[ 0 ] === "object") {
			this.collections = {
				...this.collections,
				...collections[ 0 ],
			};
		} else {
			this.collections = {
				...this.collections,
				...Object.fromEntries(collections.map(name => [ name, new CardCollection({ deck: this }) ])),
			};
		}

		return this;
	}
	removeCollections(...collections) {
		const obj = Object.entries(this.collections);

		for(let entry of collections) {
			if(typeof entry === "string" || entry instanceof String) {
				delete obj[ entry ];
			} else if(entry instanceof CardCollection) {
				for(let [ key, value ] of Object.entries(this.collections)) {
					if(value === entry) {
						delete obj[ key ];
					}
				}
			}
		}

		this.collections = obj;

		return this;
	}

	addCards(cards = [], collection) {
		if(!Array.isArray(cards)) {
			cards = [ cards ];
		}

		for(let card of cards) {
			if(card instanceof CardCollection) {
				console.log(card.cards, collection)
				this.addCards(card.cards, collection);
			} else if(card instanceof Card) {
				card.deck = this;
				
				this.cards.add(card);
			}
		}

		if(collection) {
			this.collections[ collection ].add(...cards);
		}

		return this;
	}
	removeCards(cards = [], collection) {
		if(!Array.isArray(cards)) {
			cards = [ cards ];
		}

		for(let card of cards) {
			if(card instanceof CardCollection) {
				this.removeCards(card.cards, collection);
			} else if(card instanceof Card) {
				card.deck = null;
				
				this.cards.delete(card);
			}
		}
		
		if(collection) {
			this.collections[ collection ].remove(...cards);
		}

		return this;
	}

	moveCards(cards = [], from = "deck", to = "discard") {
		if(this.collections[ from ].has(...cards)) {
			this.collections[ to ].add(...cards);
			this.collections[ from ].remove(...cards);

			return true;
		} else {
			for(let card of cards) {
				if(this.collections[ from ].has(card)) {
					this.collections[ to ].add(card);
					this.collections[ from ].remove(card);
				}
			}
		}

		return false;
	}
	


	draw(qty = 1) {
		const cards = this.collections.deck.splice(0, qty);

		if(cards.length > 1) {
			return cards;
		}

		return (cards || [])[ 0 ];
	}
	drawFromBottom(qty = 1) {
		const cards = this.collections.deck.splice(-qty, qty);

		if(cards.length > 1) {
			return cards;
		}

		return (cards || [])[ 0 ];
	}

	discard(...cards) {
		for(let card of cards) {
			if(this.cards.includes(card)) {
				
			}
		}
	}
	
	shuffle(resetDeck = false) {
		if(resetDeck === true) {
			for(let collection of Object.values(this.collections)) {
				collection.empty();
			}

			this.collections.deck.add(...this.cards);
		}

		var m = this.cards.length, t, i;

		// While there remain elements to shuffle…
		while (m) {

			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = this.cards[ m ];
			this.cards[ m ] = this.cards[ i ];
			this.cards[ i ] = t;
		}

		return this.cards;
	}
	reshuffle() {
		return this.shuffle(true);
	}

	createCards(collection = "deck", seedFn, qty = 1) {
		const cards = Card.FromSchema(seedFn, qty);
		
		this.addCards(cards, collection);

		return this;
	}
};

export default Deck;