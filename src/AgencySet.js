import Emitter from "./event/Emitter";

export class AgencySet extends Emitter {
	static Signal = {
		CLEAR: "Set.Clear",
		DELETE: "Set.Delete",
		RESEED: "Set.Reseed",
		ADD: "Set.Add",
	};

	constructor(values = []) {
		super();

		this.__set = new Set(values);
	}

	reseed(values) {
		this.__set = new Set(values);
		this.emit(AgencySet.Signal.RESEED);

		return this;
	}

	get size() {
		return this.__set.size;
	}
	get has() {
		return this.__set.has;
	}
	
	clear() {
		this.__set.clear();
		this.emit(AgencySet.Signal.CLEAR);

		return this;
	}

	get(index) {
		return [ ...this.__set ][ index ];
	}

	delete(input) {
		const result = this.__set.delete(input);

		if(result) {
			this.emit(AgencySet.Signal.DELETE, input);
		}

		return result;
	}
	add(input) {
		this.__set.add(input);

		this.emit(AgencySet.Signal.ADD, input);

		return this;
	}

	//NOTE:	These do NOT return a <Set Iterator>, but instead return an <Array>
	keys() {
		return [ ...this.__set ].map((v, i) => i);
	}
	values() {
		return [ ...this.__set ];
	}
	entries(asObject = false) {
		if(asObject) {
			return { ...[ ...this.__set ] };
		}

		return [ ...this.__set ].map((v, i) => [ i, v ]);
	}

	map(fn, { reseed = false, asObject = false } = {}) {
		const entries = this.entries();
		const result = [];

		let i = 0;
		for(let [ key, value ] of entries) {
			result.push(fn(key, value, i, this));

			++i;
		}

		if(asObject) {
			return Object.fromEntries(result.map((v, i) => [ i, v ]));
		}
		
		if(reseed) {
			return this.reseed(result);
		}

		return result;
	}
};

export default AgencySet;