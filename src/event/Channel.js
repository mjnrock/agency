import AgencyBase from "./../AgencyBase";

export class Channel extends AgencyBase {
    constructor(config = {}) {
        super();

        this.handlers = new Map([
            [ "*", new Set() ],
            [ "**", new Set() ],
        ]);
        this.queue = [];

        this.config = {
            isBatchProcess: true,
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
                pre.call(message, message.type, message.data, optionArgs);
            }
        }

        const handlers = this.handlers.get(message.type) || [];
        for(let handler of handlers) {
            if(typeof handler === "function") {
                handler.call(message, message.data, optionArgs);
            }
        }

        const postHandlers = this.handlers.get("**") || [];
        for(let post of postHandlers) {
            if(typeof post === "function") {
                post.call(payload, payload.type, payload.data, optionArgs);
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