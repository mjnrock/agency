import Watchable from "./../../event/Watchable";

export class Card extends Watchable {
	constructor(state, { ...opts } = {}) {
		super(state, opts);

		// this._parent = null;
	}
};

export default Card;