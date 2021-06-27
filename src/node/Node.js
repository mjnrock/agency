import { isDeepStrictEqual } from "util";

import AgencyBase from "../AgencyBase";

export class Node extends AgencyBase {
	constructor({ state = {}, reducers = [], listeners = [], meta = {}, config = {}, children = [], refs = [] } = {}) {
		super();

		this.meta = {
			children: new Set(children),
			refs: new Map(refs),
			...meta,
		};
		this.state = state;

		this.reducers = new Set(reducers);
		this.listeners = new Set(listeners);

		this.config = {
			isLocked: false,	// Toggleable prevention of state changes
			...config,
		};
	}

	get children() {
		return this.meta.children;
	}
	child(index = 0) {
		if(Array.isArray(index)) {
			return Object.fromEntries(index.map(i => [ i, this.child(i) ]));
		}

		return [ ...this.meta.children ][ index ];
	}

	get refs() {
		return this.meta.refs;
	}
	ref(key) {
		if(Array.isArray(key)) {
			return Object.fromEntries(key.map(k => [ k, this.ref(k) ]));
		}

		return this.meta.refs.get(key);
	}

	toggle(entry) {
		this.config[ entry ] = !this.config[ entry ];

		return this;
	}
	flagOn(entry) {
		this.config[ entry ] = true;
		
		return this;
	}
	flagOff(entry) {
		this.config[ entry ] = false;

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

	attach(node) {
		if(node instanceof Node) {
			this.meta.children.add(node);
		}

		return this;
	}
	attachMany(connectArgs = []) {
		for(let args of connectArgs) {
			this.attach(...args);
		}

		return this;
	}
	detach(node) {
		if(node instanceof Node) {
			return this.meta.children.delete(node);
		}

		return false;
	}
	detachMany(disconnectArgs = []) {
		for(let args of disconnectArgs) {
			this.detach(...args);
		}

		return this;
	}

	listen(node) {
		this.listeners.add(node);

		return this;
	}
	listenMany(linkArgs = []) {
		for(let args of linkArgs) {
			this.listen(...args);
		}

		return this;
	}
	unlisten(node) {
		return this.listeners.delete(node);
	}
	unlistenMany(unlinkArgs = []) {
		for(let args of unlinkArgs) {
			this.unlisten(...args);
		}

		return this;
	}

	emit(data) {
		for(let listener of this.listeners) {
			if(listener instanceof Node) {
				listener.receive(data, this);
			} else if(typeof listener === "function") {
				listener(data, this);
			}
		}

		return this;
	}
	receive(data, sender) {
		if(this.config.isLocked) {
			return false;
		}
	
		let newState = Object.assign({}, this.state);
		for(let reducer of this.reducers) {
			if(typeof reducer === "function") {
				newState = reducer(data, sender, newState);
			}
		}

		if(isDeepStrictEqual(newState, this.state)) {
			return false;
		} else {
			this.state = newState;
		}

		this.emit(this.state);

		return this;
	}

	selfPropagate() {
		this.propagate(this.state);

		return this;
	}
	propagate(data) {
		for(let child of this.children) {
			child.receive(data, this);
		}

		return this;
	}
};

export default Node;