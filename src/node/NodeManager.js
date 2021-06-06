import Node from "./Node";

export class Node {
	constructor({ input = 1, output = 1 } = {}) {
		if(typeof input === "number") {
			this.setIn(input);
		} else {
			this.input = new Set(input);
		}

		if(typeof output === "number") {
			this.setOut(output);
		} else {
			this.output = new Set(output);
		}
	}

	getIn(port = 0) {
		return [ ...this.input ].splice(port, 1)[ 0 ];
	}
	getOut(port = 0) {
		return [ ...this.output ].splice(port, 1)[ 0 ];
	}
	
	get size() {
		return [ this.input.size, this.output.size ];
	}

	setIn(portsOrQty) {
		this.input = new Set();

		if(Array.isArray(portsOrQty)) {
			for(let port of portsOrQty) {
				if(port instanceof Node) {
					this.input.add(port);
				}
			}

			return this;
		}
		
		for(let i = 0; i < portsOrQty; i++) {
			this.input.add(new Node());
		}
		
		return this;
	}
	setOut(portsOrQty) {
		this.output = new Set();

		if(Array.isArray(portsOrQty)) {
			for(let port of portsOrQty) {
				if(port instanceof Node) {
					this.output.add(port);
				}
			}

			return this;
		}
		
		for(let i = 0; i < portsOrQty; i++) {
			this.output.add(new Node());
		}

		return this;
	}

	attach(port, listener, isInPort = true) {
		if(listener instanceof Node) {
			const arr = isInPort ? this.input : this.output;
			const [ p ] = [ ...arr ].splice(port, 1);
			
			p.link(listener);
		}
		
		return this;
	}
	detach(port, listener) {
		const [ input ] = [ ...this.input ].splice(port, 1);
		const [ output ] = [ ...this.output ].splice(port, 1);

		input.unlink(listener);
		output.unlink(listener);

		return this;
	}
	
	receive(port, sender, data) {
		const p = this.getIn(port);

		if(p instanceof Node) {
			return p.receive(sender, data);
		}
	}
	send(port, data) {
		const p = this.getOut(port);
	
		if(p instanceof Node) {
			return p.receive(this, data);
		}		
	}
};

export default Node;