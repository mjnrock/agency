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
};

export default $EventSender;