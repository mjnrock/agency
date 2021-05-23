import Registry from "./../../Registry";

import Card from "./Card";
import Deck from "./Deck";

export class CardCollection extends Registry {
	constructor(cards = []) {
		super();

		this.addCards(cards);
	}

	addCard(card, ...synonyms) {
		if(card instanceof Card) {
			this.register(card, ...synonyms);
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
		this.unregister(cardOrSynonym);

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
};

export default CardCollection;