import { v4 as uuidv4 } from "uuid";

export const $EventSender = $super => class extends $super {
    constructor({ EventSender = {}, ...rest } = {}) {
        super({ ...rest });

        this.__subscribers = new Set();
        this.__relay = typeof EventSender.relay === "function" ? EventSender.relay : (() => false);      // A bubbling function that decides whether or not the event should get bubbled ALSO        
    }

    get subscribers() {
        return Object.entries(this.__subscribers);
    }

    addSubscriber(...subscribers) {
        for(let subscriber of subscribers) {
            if(typeof subscriber === "function") {
                this.__subscribers.add(subscriber);
            } else if(subscriber instanceof Emitter) {
                this.__subscribers.add(subscriber);
            }
        }

        return this;
    }
    removeSubscriber(...subscribers) {
        let bools = [];
        for(let subscriber of subscribers) {
            bools.push(this.__subscribers.delete(subscriber));
        }

        if(bools.length === 1) {
            return bools[ 0 ];
        }

        return bools;
    }

    get $() {
        const _this = () => this;

        return {
            ...(super.$ || {}),

            emit(event, ...args) {
                const payload = "provenance" in this ? this : {
                    id: uuidv4(),
                    type: event,
                    data: args,
                    emitter: _this(),
                    provenance: new Set(),
                };
                payload.provenance.add(_this());
    
                for(let subscriber of _this().__subscribers) {
                    if(typeof subscriber === "function") {
                        subscriber.call(payload, ...args);
                    } else if(subscriber instanceof Emitter) {
                        subscriber.$._handle.call(payload, ...args);
                    }
                }
        
                return _this();
            },
            async asyncEmit(event, ...args) {
                const payload = "provenance" in this ? this : {
                    id: uuidv4(),
                    type: event,
                    data: args,
                    emitter: _this(),
                    provenance: new Set(),
                };
                payload.provenance.add(_this());
    
                for(let subscriber of _this().__subscribers) {
                    if(typeof subscriber === "function") {
                        subscriber.call(payload, ...args);
                    } else if(subscriber instanceof Emitter) {
                        subscriber.$._asyncHandler.call(payload, ...args);
                    }
                }
        
                return _this();
            },
        }
    }

    get handlers() {
        return Object.entries(this.__handlers);
    }

    addHandler(event, ...fns) {
        if(!(this.__handlers[ event ] instanceof Set)) {
            this.__handlers[ event ] = new Set();
        }

        if(Array.isArray(fns[ 0 ])) {
            fns = fns[ 0 ];
        }

        for(let fn of fns) {
            if(typeof fn === "function") {
                this.__handlers[ event ].add(fn);
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
        if(this.__handlers[ event ] instanceof Set) {
            if(Array.isArray(fns[ 0 ])) {
                fns = fns[ 0 ];
            }
            
            let bools = [];
            for(let fn of fns) {
                bools.push(this.__handlers[ event ].delete(fn));
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

export default $EventSender;