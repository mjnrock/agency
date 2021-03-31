import Emitter from "./Emitter";

/**
 * Due to the provenance chain present in a message, the <Emitter>
 *      family should be largely immune to feedback loops, as a
 *      recycled message should be ignored by the <Emitter> on any
 *      subsequent passes.
 */
export class Network extends Emitter {
    constructor(handlers = {}, opts = {}) {
        super(handlers, opts);

        this.addHandler("*", (...args) => this.onEvent(...args));

        this.__relay = (event) => event === "cats";
    }

    join(...emitters) {
        for(let emitter of emitters) {
            if(emitter instanceof Emitter) {
                emitter.addSubscriber(this);
                this.addSubscriber(emitter);
            }
        }

        return this;
    }
    leave(...emitters) {
        for(let emitter of emitters) {
            if(emitter instanceof Emitter) {
                emitter.removeSubscriber(this);
                this.removeSubscriber(emitter);
            }
        }

        return this;
    }

    /**
     * This is a convenience association to the "*" handler that can be easily reassigned externally
     *      without the additional need to manage the handler Set.
     */
    onEvent(event, ...args) {
        console.log(event, ...args);
        // this.$.emit(event, ...args);
    }
};

export default Network;