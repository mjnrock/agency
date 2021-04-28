import AgencyBase from "../AgencyBase";
import Network from "./Network";

import { compose } from "../util/helper";

export const $Dispatcher = $super => class extends $super {
    constructor({ Dispatcher = {}, ...rest } = {}) {
        super({ ...rest });
        
        // << this >> is trapped here, but is @target in the getters/setters --> initialize to set property descriptors from << AgencyBase >>
        this._network = null;
        this._subject = null;
        this._dispatch = null;
        this._asyncDispatch = null;
        

        this.network = Dispatcher.network;
        this.subject = Dispatcher.subject;
    }

    reassign(network, subject) {
        this.network = network;
        this.subject = subject;

        return this;
    }

    get network() {
        return this._network;
    }
    set network(network) {
        if(network instanceof Network) {
            this._network = network;
    
            this.dispatch = network.emit;
            this.asyncDispatch = network.asyncEmit;
        }
    }

    get subject() {
        return this._subject;
    }
    set subject(subject) {
        if(subject !== void 0) {
            this._subject = subject;
        }
    }

    get dispatch() {
        return this._dispatch;
    }
    set dispatch(fn) {
        if(typeof fn === "function") {
            this._dispatch = (...args) => {
                if(this.subject) {
                    fn.call(this.network, this.subject, ...args);
                } else {
                    fn.call(this.network, ...args);
                }
            };
        }
    }

    get asyncDispatch() {
        return this._asyncDispatch;
    }
    set asyncDispatch(fn) {
        if(typeof fn === "function") {
            this._asyncDispatch = (...args) => {
                if(this.subject) {
                    fn.call(this.network, this.subject, ...args);
                } else {
                    fn.call(this.network, ...args);
                }
            };
        }
    }
};

/**
 * Wrapper class to directly emit to a previously assigned <Network>.
 * If a @subject is passed, use as the emitter.
 * 
 * This is, in some sense, a flyweight <Emitter>, for simplifying cases
 * where a <Network> handles everything, but events need to get routed
 * to that network.  While <Network> exposes this, <Dispatcher> allows
 * for a @subject to be bound, so as to be functionally similar to an
 * <Emitter>.
 */
export class Dispatcher extends compose($Dispatcher)(AgencyBase) {
    constructor(network, subject, opts = {}) {
        super({
            Dispatcher: {
                network,
                subject,
            },
            ...opts,
        });
    }
}

export default Dispatcher;