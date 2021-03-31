import { v4 as uuidv4 } from "uuid";

import AgencyBase from "./../AgencyBase";

export class Emitter extends AgencyBase {
    constructor(handlers = {}, { relay, filter } = {}) {
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
    }

    [ Symbol.iterator ]() {
        var index = -1;
        var data = [ ...this.__subscribers ];

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
    //#endregion RECEIVING

    get $() {
        const _this = this;

        return {
            async emit(event, ...args) {
                const payload = "provenance" in this ? this : {
                    id: uuidv4(),
                    event,
                    data: args,
                    emitter: _this,
                    provenance: new Set(),
                };
                payload.provenance.add(_this);
    
                for(let subscriber of _this.__subscribers) {
                    if(typeof subscriber === "function") {
                        subscriber.call(payload, event, ...args);
                    } else if(subscriber instanceof Emitter) {
                        subscriber.$.handle.call(payload, event, ...args);
                    }
                }
        
                return _this;
            },
            async handle(event, ...args) {
                const payload = "provenance" in this ? this : _this;

                if((payload.provenance || {}).has(_this) === false) {
                    if(typeof _this.__filter === "function" && _this.__filter.call(payload, event, ...args) === true) {
                        const receivers = _this.__handlers[ "*" ] || [];
                        for(let receiver of receivers) {
                            if(typeof receiver === "function") {
                                receiver.call(payload, event, ...args);
                            }
                        }
                        
                        const handlers = _this.__handlers[ event ] || [];
                        for(let handler of handlers) {
                            if(typeof handler === "function") {
                                handler.call(payload, ...args);
                            }
                        }
                        
                        if(typeof _this.__relay === "function" && _this.__relay.call(payload, event, ...args) === true) {
                            _this.$.emit.call(payload, event, ...args);
                        }
                    }
                }
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