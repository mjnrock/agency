import $EventReceiver from "./$EventReceiver";
import $EventSender from "./$EventSender";

import AgencyBase from "./../AgencyBase";
import System from "./System";

import { compose } from "./../util/helper";

export const EmitterBase = (...mixins) => compose(...mixins, $EventReceiver, $EventSender)(AgencyBase);

export class Emitter extends EmitterBase() {
    constructor(handlers = {}, { relay, filter, injectMiddleware = true } = {}) {
        super({
            EventReceiver: {
                filter,
                handlers,
            },
            EventSender: {
                relay,
            },
        });

        if(injectMiddleware) {
            System.Middleware(this);
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

    is(input) {
        return this === input
            || ((typeof input === "string" || input instanceof String) && this.id === input)
            || (typeof input === "object" && (this.id === input.id || this.id === input._id || this.id === input.__id));
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