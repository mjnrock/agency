import AgencyBase from "./../AgencyBase";
import Message from "./Message";

export const $Dispatchable = $super => class extends $super {
    constructor({ Dispatchable = {}, ...rest } = {}) {
        super({ ...rest });
		
		this.channel = new Channel({ handlers: {
			...(Dispatchable.hooks || {}),
		} });
    }

	hook(handlers = {}) {
		this.channel.parseHandlerObject(handlers);

		return this;
	}
	dispatch(type, ...args) {
		this.channel.bus(new Message(this, type, ...args));
	}
};

export class Channel extends AgencyBase {
    constructor({ globals = {}, config = {}, handlers = {} } = {}) {
        super();

        this.globals = globals;
        this.handlers = new Map([
            [ "*", new Set() ],
            [ "**", new Set() ],
        ]);
        this.queue = [];

		this.parseHandlerObject(handlers);

        this.config = {
            isBatchProcess: false,
            maxBatchSize: 1000,
            ...config,
        };
    }

	parseHandlerObject(handlers) {
		for(let [ key, value ] of Object.entries(handlers)) {
			if(key === "$globals") {
				for(let [ k, v ] of Object.entries(value)) {
					this.globals[ k ] = v;
				}
			} else if(key === "$reducers") {
				for(let [ k, v ] of Object.entries(value)) {
					if(!Array.isArray(v)) {
						v = [ v ];
					}

					this.addReducer(k, ...v);
				}
			} else if(key === "$mergeReducers") {
				for(let [ k, v ] of Object.entries(value)) {
					if(!Array.isArray(v)) {
						v = [ v ];
					}

					this.addMergeReducer(k, ...v);
				}
			} else if(key === "$effects") {
				for(let [ k, v ] of Object.entries(value)) {
					if(!Array.isArray(v)) {
						v = [ v ];
					}

					this.addEffect(k, ...v);
				}
			} else if(key === "$delete") {
				for(let [ k, v ] of Object.entries(value)) {
					if(!Array.isArray(v)) {
						v = [ v ];
					}

					this.removeHandler(k, ...v);
				}
			} else {
				if(!Array.isArray(value)) {
					value = [ value ];
				}

				this.addHandler(key, ...value);
			}
		}
	}

    /**
     * Turn off the batching process and process any event
     *  that comes through as it comes through
     */
    useRealTimeProcess() {
        this.config.isBatchProcess = false;
    }
    /**
     * Queue *all* events that get captured and store them in
     *  the queue until << .process() >> is invoked up to the
     *  << this.config.maxBatchSize >>.
     */
    useBatchProcess() {
        this.config.isBatchProcess = true;
    }
    setBatchSize(size = 1000) {
        this.config.maxBatchSize = size;
    }

    enqueue(...items) {
        this.queue.push(...items);

        return this;
    }
    dequeue() {
        if(this.queue.length) {
            return this.queue.shift();
        }
    }
    empty() {
        this.queue = [];

        return this;
    }

    get isEmpty() {
        return !this.queue.length;
    }


    bus(message) {
        if(this.config.isBatchProcess) {
            return this.enqueue(message);
        }

        return this.invokeHandlers(message);
    }
    process() {
        let i = 0;
        while(!this.isEmpty && i < this.config.maxBatchSize) {
            const message = this.dequeue();

            this.invokeHandlers(message);
            ++i;
        }

        return this;
    }


    /**
     * An extracted invocation method so that << .bus >> can
     *  bypass the queue if in real-time mode.
	 * 
	 * NOTE: If a "*" handler returns << false >>, the *entire*
	 * 	invocation will halt and return << false >> and no further
	 * 	handlers will fire.  As such, this allows "*" to be used 
	 * 	as a de facto <Channel> filter.
     */
    invokeHandlers(message) {
        const optionArgs = {
            ...this.globals,
            channel: this,
        };

        const preHandlers = this.handlers.get("*") || [];
        for(let pre of preHandlers) {
            if(typeof pre === "function") {
                let result = pre(message, optionArgs);

				// Pre-check escape activation
				if(result === false) {
					return false;
				}
            }
        }

        const handlers = this.handlers.get(message.type) || [];
        for(let handler of handlers) {
            if(typeof handler === "function") {
                handler(message, optionArgs);
            }
        }

        const postHandlers = this.handlers.get("**") || [];
        for(let post of postHandlers) {
            if(typeof post === "function") {
                post(message, optionArgs);
            }
        }

        return this;
    }

    addHandler(event, ...fns) {
        if(!(this.handlers.get(event) instanceof Set)) {
            this.handlers.set(event, new Set());
        }

        if(Array.isArray(fns[ 0 ])) {
            fns = fns[ 0 ];
        }

        for(let fn of fns) {
            if(typeof fn === "function") {
                this.handlers.get(event).add(fn);
            }
        }

        return this;
    }
    addHandlers(addHandlerArgs = []) {
        for(let [ event, ...fns ] of addHandlerArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            this.addHandler(event, ...fns);
        }

        return this;
    }
    removeHandler(event, ...fns) {
        if(this.handlers.get(event) instanceof Set) {
            if(Array.isArray(fns[ 0 ])) {
                fns = fns[ 0 ];
            }
            
            let bools = [];
            for(let fn of fns) {
                bools.push(this.handlers.get(event).delete(fn));
            }

            if(bools.length === 1) {
                return bools[ 0 ];
            }

            return bools;
        }

        return false;
    }
    removeHandlers(addHandlerArgs = []) {
        for(let [ event, ...fns ] of addHandlerArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            this.removeHandler(event, ...fns);
        }

        return this;
    }
	
    addReducer(event, ...fns) {
        const newFns = fns.map(fn => (msg, { setState, getState, ...rest }, ...args) => {
			setState(fn(msg, { setState, state: getState(), ...rest }, ...args));
		});

		this.addHandler(event, ...newFns);

		return [ event, newFns ];
    }
    addMergeReducer(event, ...fns) {
        const newFns = fns.map(fn => (msg, { mergeState, getState, ...rest }, ...args) => {
			mergeState(fn(msg, { mergeState, state: getState(), ...rest }, ...args));
		});

		this.addHandler(event, ...newFns);

		return [ event, newFns ];
    }
    addReducers(addReducerArgs = []) {
		const newFns = [];
        for(let [ event, ...fns ] of addReducerArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            newFns.push(this.addReducer(event, ...fns));
        }

        return newFns;
    }
    addMergeReducers(addMergeReducerArgs = []) {
		const newFns = [];
        for(let [ event, ...fns ] of addMergeReducerArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            newFns.push(this.addMergeReducer(event, ...fns));
        }

        return newFns;
    }
	get removeReducer() {
		return this.removeHandler;
	}
	get removeReducers() {
		return this.removeHandlers;
	}
	get removeMergeReducer() {
		return this.removeHandler;
	}
	get removeMergeReducers() {
		return this.removeHandlers;
	}
	get removeEffect() {
		return this.removeHandler;
	}
	get removeEffects() {
		return this.removeHandlers;
	}

	/**
	 * Effects are fired *after* a single *message* has been handled.
	 * 	As such, effects will fire **once per message** when dealing with
	 * 	<MessageCollections> (i.e. << messages.size >> times).
	 */
	addEffect(event, ...fns) {
		const newFn = (msg, ...args) => {
			if(msg.type === event) {
				for(let fn of fns) {
					fn(msg, ...args);
				}
			}
		};
		
		this.addHandler("**", newFn);

		return [ event, newFn ];
	}
	addEffects(addEffectArgs = []) {
		const newFns = [];
        for(let [ event, ...fns ] of addEffectArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            newFns.push(this.addEffect(event, ...fns));
        }

        return newFns;
	}

    /**
     * This is similar to .addHandlers, but will erase any existing handlers, first.
     */
    reassignHandlers(addHandlerArgs = []) {
        this.handlers = new Map([
            [ "*", new Set() ],
        ]);

        this.addHandlers(addHandlerArgs);

        return this;
    }
};

export default Channel;