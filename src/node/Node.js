import AgencyBase from "../AgencyBase";

export class Node extends AgencyBase {
	constructor({ state = {}, reducers = [], listeners = [], meta = {} } = {}) {
		super();

		this.meta = meta;
		this.state = state;
		this.reducers = new Set(reducers);
		this.listeners = new Set(listeners);
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
	unlink(node) {
		return this.listeners.delete(node);
	}

	receive(data) {
		for(let reducer of this.reducers) {
			if(typeof reducer === "function") {
				this.state = reducer(data, this.state, this.meta);
			}
		}

		for(let listener of this.listeners) {
			if(listener instanceof Node) {
				listener.receive(this.state, this.id);
			} else if(typeof listener === "function") {
				listener(this.state, this.id);
			}
		}
	}
};

export default Node;