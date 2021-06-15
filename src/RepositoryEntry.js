import AgencyBase from "./AgencyBase";
import Watchable from "./event/watchable/Watchable";
// import { $Emitter } from "./event/watchable/$Emitter";
// import { compose } from "./util/helper";

// export class RepositoryEntry extends compose($Emitter)(AgencyBase) {
export class RepositoryEntry extends AgencyBase {
	constructor(entry, order, { state = {}, synonyms = [], ...opts } = {}) {
		super();

		this._entry = entry;
		this.order = order;
		this.state = new Watchable(state, opts);
		this.synonyms = synonyms;
	}
};

export default RepositoryEntry;