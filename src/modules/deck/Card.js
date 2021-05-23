import AgencyBase from "./../../AgencyBase";
import CardCollection from "./CardCollection";

export class Card extends AgencyBase {
	constructor({ deck, state = {} } = {}) {
		super();

		this._deck = deck;
		
		this.state = state;
	}

	get deck() {
		return this._deck;
	}
	set deck(deck) {
		this._deck = deck;
	}

	discard() {
		if(this._deck) {
			this._deck.discard(this);
		}

		return this;
	}

	static FromSchema(seedFn, qty = 1) {
		const cards = [];

		for(let i = 0; i < qty; i++) {
			cards.push(new Card({
				state: seedFn(i),
			}));
		}

		if(qty > 1) {
			return new CardCollection({ cards });
		}

		return cards[ 0 ];
	}
};

export default Card;