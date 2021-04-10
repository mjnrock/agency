import Registry from "../Registry";

export class Context extends Registry {
    constructor({ globals = {}, handlers = {}, ...config } = {}) {
        super();

        this.globals = globals;
        this.queue = [];
        this.handlers = new Map([
            [ "*", new Set() ],
        ]);

        this.config = {
            isBatchProcess: true,
            maxBatchSize: 1000,
            ...config,
        }

        for(let [ event, fns ] of Object.entries(handlers)) {
            this.addHandler(event, fns);
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


    /**
     * The interception function that is used to route an event
     *  to a <Context>
     */
    bus(payload, args) {
        if(this.config.isBatchProcess) {
            return this.enqueue([ payload, args ]);
        }

        return this.invokeHandlers(payload, args);
    }


    get isEmpty() {
        return !this.state.queue.length;
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


    process() {
        let i = 0;
        while(!this.isEmpty && i < this.config.maxBatchSize) {
            const [ payload, args ] = this.dequeue();

            this.invokeHandlers(payload, args);
            ++i;
        }

        return this;
    }
    empty() {
        this.queue = [];

        return this;
    }


    /**
     * An extracted invocation method so that << .bus >> can
     *  bypass the queue if in real-time mode.
     */
    invokeHandlers(payload, args) {        
        const optionArgs = {
            ...this.globals,
            enqueue: this.enqueue.bind(this),
            context: this,
        };

        const receivers = this.handlers.get("*") || [];
        for(let receiver of receivers) {
            if(typeof receiver === "function") {
                receiver.call(payload, payload.type, args, optionArgs);
            }
        }

        const handlers = this.handlers.get(payload.type) || [];
        for(let handler of handlers) {
            if(typeof handler === "function") {
                handler.call(payload, args, optionArgs);
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
        for(let [ event, ...fns ] of addHandlerArgs) {
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
        for(let [ event, ...fns ] of addHandlerArgs) {
            this.removeHandler(event, ...fns);
        }

        return this;
    }
};

export default Context;