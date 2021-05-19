import AgencyBase from "../AgencyBase";
import Network from "./Network";

import { compose } from "../util/helper";

export const $Dispatcher = $super => class extends $super {
    constructor({ Dispatcher = {}, ...rest } = {}) {
        super({ ...rest });
        
        // << this >> is trapped here, but is @target in the getters/setters --> initialize to set property descriptors from << AgencyBase >>
        this._subject = null;
        this._network = null;
        this._dispatch = null;
        this._broadcast = null;
        
        this.network = Dispatcher.network;
        this.subject = Dispatcher.subject;
        this.middleware = Dispatcher.middleware;
        
        if(Dispatcher.subject === true) {
            this.subject = Dispatcher.network;  //  sic
        }
    }

    /**
     * ? Convenience Method
     * Reassign the @network and @subject in one call
     */
    reassign(network, subject, middleware) {
        this.network = network;
        this.subject = subject;
        this.middleware = middleware;

        return this;
    }

    /**
     * The <Network> to use as the messaging system.
     */
    get network() {
        return this._network;
    }
    set network(network) {
        if(network instanceof Network) {
            this._network = network;
    
            this.dispatch = network.__bus.emit;
            this.broadcast = network.broadcast;
        }
    }

    /**
     * The << subject >> allows a default emitter to
     *  be bound to the <Dispatcher> invocations.
     */
    get subject() {
        return this._subject;
    }
    set subject(subject) {
        if(subject !== void 0) {
            this._subject = subject;
        }
    }

    /**
     * The << middleware >> allows a default middleware to
     *  be bound to the <Dispatcher> invocations.
     */
    get middleware() {
        if(typeof this._middleware === "function") {
            return this._middleware;
        }
		
		return (network, subject, args) => args;
    }
    set middleware(middleware) {
        if(typeof middleware === "function") {
            this._middleware = middleware;
        }
    }


    /**
     * The dispatch methods allow for a message to be sent
     *  directly to << this.network >> via << .emit >>.  As such,
     *  routing is utilized.
     */
    get dispatch() {
        return this._dispatch;
    }
    set dispatch(fn) {
        if(typeof fn === "function") {
            this._dispatch = (...args) => {
				const params = this.middleware(this.network.__bus, this.subject, args) || args;

                if(this.subject) {
                    fn.call(this.network.__bus, this.subject, ...params);
                } else {
                    fn.call(this.network.__bus, ...params);
                }
            };
        }
    }


    /**
     * The broadcast methods allow for a message to be sent
     *  directly to each <Network> connection.  This, if used
     *  in a network hierarchy, can be used as a bubbler.  It
     *  will invoke the << .route >> function, ensuring that
     *  the (connected) <Network(s)> routing is utilized.
     */
    get broadcast() {
        return this._broadcast;
    }
    set broadcast(fn) {
		if(typeof fn === "function") {
			this._broadcast = (...args) => {
				const params = this.middleware(this.network, this.subject, args) || args;

                if(this.subject) {
                    fn.call(this.network, this.subject, ...params);
                } else {
                    fn.call(this.network, ...params);
                }
            };
        }
    }
};

/**
 * This class extracts the message invocation functions from <Network>
 *  and allows a @subject and @network to be bound, so that this class
 *  can act as a proxy or conduit to invoke that functionality.
 * 
 * If a @subject is present, then it will be injected as the first argument
 *  in a given function invocation.  All invocations will be given the
 *  <Network> as its << this >> binding.
 *
 *  << <Network> .emit | .broadcast | .sendToChannel >> are all exposed.
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