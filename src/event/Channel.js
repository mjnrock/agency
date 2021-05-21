import AgencyBase from "./../AgencyBase";

export class Channel extends AgencyBase {
    constructor({ globals = {}, config = {} } = {}) {
        super();

        this.globals = globals;
        this.handlers = new Map([
            [ "*", new Set() ],
            [ "**", new Set() ],
        ]);
        this.queue = [];

        this.config = {
            isBatchProcess: false,
            maxBatchSize: 1000,
            ...config,
        };
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
     */
    invokeHandlers(message) {
        const optionArgs = {
            ...this.globals,
            channel: this,
        };

        const preHandlers = this.handlers.get("*") || [];
        for(let pre of preHandlers) {
            if(typeof pre === "function") {
                pre(message, optionArgs);
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