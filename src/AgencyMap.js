import Emitter from "./event/Emitter";

export class AgencyMap extends Emitter {
	static Signal = {
		CLEAR: "Map.Clear",
		DELETE: "Map.Delete",
		RESEED: "Map.Reseed",
		SET: "Map.Set",
	};

	constructor(entries = []) {
		super();

		if(Array.isArray(entries)) {
			this.__map = new Map(entries);
		} else if(typeof entries === "object") {
			this.__map = new Map(Object.entries(entries));
		}
	}

	reseed(entries) {
		if(Array.isArray(entries)) {
			this.__map = new Map(entries);
		} else if(typeof entries === "object") {
			this.__map = new Map(Object.entries(entries));
		}

		this.emit(AgencyMap.Signal.RESEED);
		
		return this;
	}

	get size() {
		return this.__map.size;
	}
	get has() {
		return this.__map.has;
	}
	
	clear() {
		this.__map.clear();
		this.emit(AgencyMap.Signal.CLEAR);

		return this;
	}

	get(key) {
		return this.__map.get(key);
	}

	delete(input) {
		const result = this.__map.delete(input);

		if(result) {
			this.emit(AgencyMap.Signal.DELETE, input);
		}

		return result;
	}
	set(key, value) {
		this.__map.set(key, value);

		this.emit(AgencyMap.Signal.SET, key, value);

		return this;
	}

	//NOTE:	These do NOT return a <Map Iterator>, but instead return an <Array>
	keys() {
		return [ ...this.__map.keys() ];
	}
	values() {
		return [ ...this.__map.values() ];
	}
	entries(asObject = false) {
		if(asObject) {
			return Object.fromEntries(this.__map.entries());
		}

		return [ ...this.__map.entries() ];
	}

	map(fn, { asReseed = false, asObject = false } = {}) {
		const entries = this.entries();
		const result = [];

		let i = 0;
		for(let [ key, value ] of entries) {
			result.push(fn(key, value, i, this));

			++i;
		}

		if(asObject) {
			return Object.fromEntries(result);
		}

		if(asReseed) {
			return this.reseed(result);
		}

		return result;
	}
};

export default AgencyMap;