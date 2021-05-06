import AgencyBase from "../AgencyBase";
import Network, { BasicNetwork } from "./Network";

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
        
        if(Dispatcher.subject === true) {
            this.subject = Dispatcher.network;  //  sic
        }
    }

    /**
     * ? Convenience Method
     * Reassign the @network and @subject in one call
     */
    reassign(network, subject) {
        this.network = network;
        this.subject = subject;

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
    
            this.dispatch = network.emit;
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
                if(this.subject) {
                    fn.call(this.network, this.subject, ...args);
                } else {
                    fn.call(this.network, ...args);
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

    /**
     * This is a basic helper function to create a new <BasicNetwork>
     *  and attach a newly created <Dispatcher> to that network.
     * 
     * A @subject and @handlers can be passed to seed these.
     */
    static CreateNetwork(subject, handlers = {}) {
        const network = new BasicNetwork(handlers);

        return new Dispatcher(network, subject);
    }
}

export default Dispatcher;