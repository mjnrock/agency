export class MessageCollection {
	constructor(messages = [], {
		maxSize = Infinity,
		current = 0,
		sorter,
		middleware,
	}) {
		this.messages = new Set(messages);

		this.maxSize = maxSize;
		this._current = current;
		this.sorter = sorter;
		this.middleware = middleware;
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
		this.messages.add(message);

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
		return [ ...this.messages ].map(m => m.toObject());
	}

	inject(network) {
		let messages = this.get();
		if(typeof this.sorter === "function") {
			messages = this.sorter(messages);
		}
		
		for(let message of messages) {
			if(typeof this.middleware === "function") {
				message = this.middleware(message);
			}

			network.message(message);
		}
	}
	async asyncInject(network) {
		let messages = this.get();
		if(typeof this.sorter === "function") {
			messages = await this.sorter(messages);
		}
		
		for(let message of messages) {
			if(typeof this.middleware === "function") {
				message = await this.middleware(message);
			}

			network.message(message);
		}
	}
};

export default MessageCollection;