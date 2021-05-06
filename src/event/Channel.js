import Registry from "../Registry";
import Dispatcher from "./Dispatcher";

export class Channel extends Registry {
    static Signals = {
        UPDATE: "Agency.Event.Channel.Update",
    };

    constructor(network, { globals = {}, handlers = {}, hooks = {}, state = {}, ...config } = {}) {
        super();

        this.network = network;

        this.globals = globals;
        this.hooks = hooks;
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

        this._channelState = state;
        this._channelStateDispatcher = new Dispatcher(network, this);
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
    empty() {
        this.queue = [];

        return this;
    }


    /**
     * The interception function that is used to route an event
     *  to a <Channel>
     */
    bus(payload) {
        if(this.config.isBatchProcess) {
            return this.enqueue(payload);
        }

        return this.invokeHandlers(payload);
    }
    process() {
        if(typeof this.hooks.pre === "function") {
            this.hooks.pre(this);
        }

        let i = 0;
        while(!this.isEmpty && i < this.config.maxBatchSize) {
            const payload = this.dequeue();

            this.invokeHandlers(payload);
            ++i;
        }

        if(typeof this.hooks.post === "function") {
            this.hooks.post(this);
        }

        return this;
    }


    /**
     * An extracted invocation method so that << .bus >> can
     *  bypass the queue if in real-time mode.
     */
    invokeHandlers(payload) {
        const optionArgs = {
            ...this.globals,
            channel: this,
            state: Object.assign({}, this.getState()),
            setState: state => this.setState(state, false),
            mergeState: state => this.setState(state, true),
            network: this.network,
        };

        const receivers = this.handlers.get("*") || [];
        for(let receiver of receivers) {
            if(typeof receiver === "function") {
                receiver.call(payload, payload.type, payload.data, optionArgs);
            }
        }

        const handlers = this.handlers.get(payload.type) || [];
        for(let handler of handlers) {
            if(typeof handler === "function") {
                handler.call(payload, payload.data, optionArgs);
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


    getState() {
        return this._channelState;
    }
    setState(state = {}, isMerge = false) {
        let newState = {};

        if(isMerge) {
            newState = {
                ...this._channelState,
                ...state,
            };
        } else {
            newState = state;
        }

        let args = [
            Object.assign({}, newState),
            Object.assign({}, this._channelState),
            Object.assign({}, state),
        ];
        setTimeout(() => this._channelStateDispatcher.dispatch(Channel.Signals.UPDATE, ...args), 0);

        this._channelState = newState;

        return this._channelState;
    }
    mergeState(state = {}) {
        return this.setState(state, true);
    }

    setPreHook(fn) {
        if(typeof fn === "function") {
            this.hooks.pre = fn;
        }

        return this;
    }
    setPostHook(fn) {
        if(typeof fn === "function") {
            this.hooks.post = fn;
        }

        return this;
    }
};

export default Channel;