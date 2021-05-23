import { validate } from "uuid";
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

	copy(reId = false) {
		const map = new Map();
		for(let card of this) {
			if(card instanceof Card) {
				map.set(card, []);
			}
		}
		for(let synonym of this.synonyms) {
			const card = this[ synonym ];
			const current = map.get(card);

			map.set(card, [ ...current, synonym ]);
		}

		const cc = new CardCollection();
		const ccObj = [ ...map ].map(([ k, v ]) => {
			const newCard = k.$copy(reId);

			return [
				newCard,
				v,
			];
		});

		for(let [ card, ...synonyms ] of ccObj) {
			cc.addCard(card, ...synonyms);
		}

		return cc;
	}

	//FIXME
	toDeck(...collections) {
		const deck = new Deck();

		return deck;
	}
	static FromDeck(deck) {

	}
};

export default CardCollection;