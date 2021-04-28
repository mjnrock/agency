import { v4 as uuidv4 } from "uuid";

import $EventReceiver from "./$EventReceiver";
import $EventSender from "./$EventSender";

import AgencyBase from "./../AgencyBase";

import { compose } from "./../util/helper";

export const EmitterBase = (...mixins) => compose(...mixins, $EventReceiver, $EventSender)(AgencyBase);

export class Emitter extends EmitterBase() {
    static Instance = new Emitter();
    static get $() {
        if(!Emitter.Instance) {
            Emitter.Instance = new Emitter();
        }

        return Emitter.Instance;
    }

    constructor(handlers = {}, { relay, filter, network } = {}) {
        super({
            EventReceiver: {
                filter,
                handlers,
            },
            EventSender: {
                relay,
            },
        });

        if(network) {
            network.join(this);
            this.__deconstructor = () => network.leave(this);
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

    /**
     * Invoke an event that will, instead of being emitted, be routed to the internal handlers.
     * NOTE:    This will **not** invoke subscribers or relays.
     */
    invoke(event, ...args) {
        const payload = {
            id: uuidv4(),
            type: event,
            data: args,
            emitter: this,
            provenance: new Set(),
        };

        if(typeof this.__filter === "function" && this.__filter.call(payload, ...args) === true) {
            const receivers = this.__handlers[ "*" ] || [];
            for(let receiver of receivers) {
                if(typeof receiver === "function") {
                    receiver.call(payload, ...args);
                }
            }
            
            const handlers = this.__handlers[ event ] || [];
            for(let handler of handlers) {
                if(typeof handler === "function") {
                    handler.call(payload, ...args);
                }
            }

            return true;
        }

        return false;
    }
    async asyncInvoke(event, ...args) {
        return Promise.resolve(this.invoke(event, ...args));
    }

    is(input) {
        return this === input
            || ((typeof input === "string" || input instanceof String) && this.id === input)
            || (typeof input === "object" && (this.id === input.id || this.id === input._id || this.id === input.__id));
    }

    __deconstructor() {};
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