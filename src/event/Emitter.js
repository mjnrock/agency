import { v4 as uuidv4 } from "uuid";

import AgencyBase from "./../AgencyBase";
import EventBus from "./EventBus";

export class Emitter extends AgencyBase {
    constructor(handlers = {}, { relay, filter, injectMiddleware = true } = {}) {
        super();

        //#region RECEIVING
            this.__filter = filter || (() => true);     // Universal filter that executed immediately in .handle to determine if should proceed
            this.__handlers = {
                "*": new Set(),
            };
            for(let [ event, fns ] of Object.entries(handlers)) {
                this.addHandler(event, fns);
            }
        //#endregion RECEIVING
        
        //#region SENDING
            this.__subscribers = new Set();
            this.__relay = relay || (() => false);      // A bubbling function that decides whether or not the event should get bubbled ALSO        
        //#endregion SENDING

        if(injectMiddleware) {
            EventBus.Middleware(this);
        }
    }

    /**
     * Allow the <Emitter> to be used as a "subscription iterator" for <Emitter> only!
     */
    [ Symbol.iterator ]() {
        var index = -1;
        var data = [ ...this.__subscribers ].filter(s => s instanceof Emitter);

        return {
            next: () => ({ value: data[ ++index ], done: !(index in data) })
        };
    }

    //#region SENDING
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
    //#endregion SENDING

    //#region RECEIVING
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
    //#endregion RECEIVING

    get $() {
        const _this = () => this;

        return {
            async emit(event, ...args) {
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
            /**
             * This is an internal function, so you must bind a proper payload before using outside of its
             *      normal, singular scope within the emit function.  It is only here to exploit "this" bindings.
             */
            async _handle(...args) {
                const payload = this;

                if(payload.provenance.has(_this()) === false) {
                    if(typeof _this().__filter === "function" && _this().__filter.call(payload, ...args) === true) {
                        const receivers = _this().__handlers[ "*" ] || [];
                        for(let receiver of receivers) {
                            if(typeof receiver === "function") {
                                receiver.call(payload, ...args);
                            }
                        }
                        
                        const handlers = _this().__handlers[ this.type ] || [];
                        for(let handler of handlers) {
                            if(typeof handler === "function") {
                                handler.call(payload, ...args);
                            }
                        }
                        
                        if(typeof _this().__relay === "function" && _this().__relay.call(payload, ...args) === true) {
                            _this().$.emit.call(payload, this.type, ...args);
                        }
                    }

                    return true;
                }

                return false;
            }
        }
    }
};

export async function Factory({ amount = 1, argsFn, each } = {}) {
    const emitters = [];
    for(let i = 0; i < amount; i++) {
        let emitter;
        if(typeof argsFn === "function") {
            emitter = new Emitter(...argsFn(i));
        } else {
            emitter = new Emitter();
        }

        emitters.push(emitter);

        if(typeof each === "function") {
            each(emitter, i);
        }
    }

    return emitters;
};

Emitter.Factory = Factory;

export default Emitter;