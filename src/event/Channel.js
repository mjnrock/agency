import { performance } from "perf_hooks";

import Registry from "../Registry";

function consoleProcessor(payload) {
    return [ payload.type, performance.now() ];
    // return [ payload.type, payload.emitter.id.slice(0, 8), performance.now() ];
}

export class Channel extends Registry {
    constructor({ globals = {}, handlers = {}, ...config } = {}) {
        super();

        this.globals = globals;
        this.queue = [];
        this.handlers = {
            "*": new Set(),
        };

        this.config = {
            maxBatchSize: 1000,
            ...config,
        }

        for(let [ event, fns ] of Object.entries(handlers)) {
            this.addHandler(event, fns);
        }
    }

    get join() {
        return this.register;
    }
    get leave() {
        return this.unregister;
    }

    bus(payload, args) {
        console.log(this.id.slice(0, 3), consoleProcessor(payload))
        return this.enqueue([ payload, args ]);
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

            const receivers = this.handlers[ "*" ] || [];
            for(let receiver of receivers) {
                if(typeof receiver === "function") {
                    receiver(payload, args, { ...this.globals, enqueue: this.enqueue.bind(this) });
                }
            }

            const handlers = this.handlers[ payload.type ] || [];
            for(let handler of handlers) {
                if(typeof handler === "function") {
                    handler(payload, args, { ...this.globals, enqueue: this.enqueue.bind(this) });
                }
            }

            ++i;
        }
    }

    addHandler(event, ...fns) {
        if(!(this.handlers[ event ] instanceof Set)) {
            this.handlers[ event ] = new Set();
        }

        if(Array.isArray(fns[ 0 ])) {
            fns = fns[ 0 ];
        }

        for(let fn of fns) {
            if(typeof fn === "function") {
                this.handlers[ event ].add(fn);
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
        if(this.handlers[ event ] instanceof Set) {
            if(Array.isArray(fns[ 0 ])) {
                fns = fns[ 0 ];
            }
            
            let bools = [];
            for(let fn of fns) {
                bools.push(this.handlers[ event ].delete(fn));
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

export default Channel;