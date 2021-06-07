import { isDeepStrictEqual } from "util";

import AgencyBase from "../AgencyBase";

export class Node extends AgencyBase {
	constructor({ state = {}, reducers = [], listeners = [], meta = {}, config = {} } = {}) {
		super();

		this.meta = meta;
		this.state = state;

		this.reducers = new Set(reducers);
		this.listeners = new Set(listeners);

		this.config = {
			lockState: false,	// Toggleable prevention of state changes
			...config,
		};
	}

	toggle(entry) {
		this.config[ entry ] = !this.config[ entry ];

		return this;
	}

	add(reducer) {
		if(typeof reducer === "function") {
			this.reducers.add(reducer);
		}

		return this;
	}
	remove(reducer) {
		return this.reducers.delete(reducer);
	}

	link(node) {
		this.listeners.add(node);

		return this;
	}
	linkMany(linkArgs = []) {
		for(let args of linkArgs) {
			this.link(...args);
		}

		return this;
	}
	unlink(node) {
		return this.listeners.delete(node);
	}
	unlinkMany(unlinkArgs = []) {
		for(let args of unlinkArgs) {
			this.unlink(...args);
		}

		return this;
	}

	receive(data) {
		if(this.config.lockState) {
			return false;
		}
	
		let newState = Object.assign({}, this.state);
		for(let reducer of this.reducers) {
			if(typeof reducer === "function") {
				newState = reducer(data, newState, this.meta);
			}
		}

		if(isDeepStrictEqual(newState, this.state)) {
			return false;
		} else {
			this.state = newState;
		}

		for(let listener of this.listeners) {
			if(listener instanceof Node) {
				listener.receive(this.state);
			} else if(typeof listener === "function") {
				listener(this.state);
			}
		}
	}
};

export default Node;