import crypto from "crypto";
import Message from "./Message";

export class MessageCollection {
	constructor(messages = [], {
		capacity = Infinity,
		current = 0,
		sorter,
		middleware,
	}) {
		this.messages = new Set();
		this.addMany(messages);

		this.capacity = capacity;
		this._current = current;
		this.sorter = sorter;
		this.middleware = middleware;
	}

	get isFull() {
		return this.messages.size >= this.capacity;
	}
	get remaining() {
		return this.capacity - this.messages.size;
	}

	get current() {
		return [ ...this.messages ][ this._current ];
	}
	set current(value) {
		this._current = value;

		const [ min, max ] = this.range;
		if(this.current > max) {
			this._current = 0;
		} else if(this.current < min) {
			this._current = max;
		}
	}

	get hasNext() {
		const [ max ] = this.range;

		return this._current < max;
	}
	next() {
		this.current += 1;
		
		return this.current;
	}
	get hasPrevious() {
		const [ min ] = this.range;

		return this._current > min;
	}
	previous() {
		this.current -= 1;

		return this.current;
	}
	reset() {
		const [ min ] = this.range;

		this.current = min;

		return this.current;
	}

	get range() {
		const [ min, max ] = [ 0, this.messages.size - 1 ];

		if(this.current >= max) {
			this.current = 0;
		} else if(this.current <= min) {
			this.current = max;
		}

		return [ min, max ];
	}

	add(message) {
		if(!this.isFull) {
			this.messages.add(message);
		}

		return this;
	}
	remove(message) {
		this.messages.delete(message);

		return this;
	}
	addMany(addArgs = []) {
		for(let message of addArgs) {
			this.add(message);
		}

		return this;
	}
	remove(removeArgs = []) {
		for(let message of removeArgs) {
			this.remove(message);
		}

		return this;
	}

	set(messages = []) {
		this.messages = new Set(messages);
	}
	get() {
		return [ ...this.messages ].map(m => Message.Generate(m.toObject()));
	}

	inject(network, middleware) {
		let messages = this.get();
		if(typeof this.sorter === "function") {
			messages = this.sorter(messages);
		}
		
		if(typeof middleware === "function") {
			network.collection(messages, middleware);
		} else {
			network.collection(messages, this.middleware);
		}
	}

    getHash(algorithm = "md5", digest = "hex") {
		const hashes = [ ...this.messages ].map(m => m.getHash(algorithm, digest)).toString();

        return crypto.createHash(algorithm).update(hashes).digest(digest);
    }

	toObject() {
		return [ ...this.messages ].map(m => m.toObject());
	}	
	toJson() {
		return [ ...this.messages ].map(m => m.toJson());
	}

	static FromObject(messageArray = []) {
		return new MessageCollection(messageArray.map(mo => Message.FromObject(mo)));
	}
	static FromJson(messageArray = []) {
		return new MessageCollection(messageArray.map(mj => Message.FromJson(mj)));
	}
};

export default MessageCollection;