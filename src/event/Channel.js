import Registry from "../Registry";

export class Channel extends Registry {
    constructor({ globals = {}, handlers = {} } = {}) {
        super();

        this.globals = globals;
        this.queue = [];
        this.handlers = {};

        for(let [ event, fns ] of Object.entries(handlers)) {
            this.addHandler(event, fns);
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

    get join() {
        return this.register;
    }
    get leave() {
        return this.unregister;
    }

    async bus(payload, args) {
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
        while(!this.isEmpty) {
            const [ payload, args ] = this.dequeue();

            const handlers = this.handlers[ payload.type ] || [];
            for(let handler of handlers) {
                if(typeof handler === "function") {
                    handler(payload, args, { ...this.globals, enqueue: this.enqueue.bind(this) });
                }
            }
        }
    }
};

export default Channel;