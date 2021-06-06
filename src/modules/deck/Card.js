import { v4 as uuidv4 } from "uuid";
import Watchable from "./../../event/Watchable";

export class Card extends Watchable {
	constructor(state, opts = {}) {
		super(state, opts);
	}

	$copy(reassignId = true, opts = {}) {
		const card = Card.Generate(this, opts);

		if(reassignId) {
			card.id = uuidv4();
		} else {
			card.id = this.id;
		}

		return card;
	}

	static FromSchema(input = []) {		
		if(!Array.isArray(input)) {
			input = [ input ];
		}
		
		const cards = [];
		for(let [ data, opts = {} ] of input) {
			cards.push(new Card(data, opts));
		}

		return cards;
	}
};

export default Card;