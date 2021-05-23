import { v4 as uuidv4 } from "uuid";
import Watchable from "./../../event/Watchable";

export class Card extends Watchable {
	constructor(state, { ...opts } = {}) {
		super(state, opts);

		// this._parent = null;
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
};

export default Card;