import Emitter from "./Emitter";

/**
 * Due to the provenance chain present in a message, the <Emitter>
 *      family should be largely immune to feedback loops, as a
 *      recycled message should be ignored by the <Emitter> on any
 *      subsequent passes.
 */
export class Network extends Emitter {
    static Events = [
        "join",
        "leave",
    ];

    constructor({ handlers = {}, pairBinding = false, ...opts } = {}) {
        super(handlers, opts);

        this.__relay = () => true;
        this.__pairBinding = pairBinding;
    }

    // get join() {
    //     return this.register;
    // }
    // get leave() {
    //     return this.unregister;
    // }

    // joinContext(nameOrContext, emitter, ...synonyms) {
    //     const context = this[ nameOrContext ];

    //     if(context instanceof Context) {            
    //         return context.join(emitter, ...synonyms);
    //     }
    // }
    // leaveContext(nameOrContext, emitterSynOrId) {
    //     const context = this[ nameOrContext ];

    //     if(context instanceof Context) {            
    //         return context.leave(emitterSynOrId, ...synonyms);
    //     }
    // }

    join(...emitters) {
        for(let emitter of emitters) {
            if(emitter instanceof Emitter) {
                emitter.addSubscriber(this);

                if(this.__pairBinding) {
                    this.addSubscriber(emitter);
                }

                this.$.emit("join", emitter);
            }
        }

        return this;
    }
    leave(...emitters) {
        for(let emitter of emitters) {
            if(emitter instanceof Emitter) {
                emitter.removeSubscriber(this);

                if(this.__pairBinding) {
                    this.removeSubscriber(emitter);
                }

                this.$.emit("leave", emitter);
            }
        }

        return this;
    }

    
    fire(event, ...args) {
        for(let emitter of this.__subscribers) {
            if(typeof emitter === "function") {
                emitter(event, ...args);
            } else if(emitter instanceof Emitter) {
                emitter.$.emit(event, ...args);
            }
        }

        return this;
    }
    async asyncFire(event, ...args) {
        for(let emitter of this.__subscribers) {
            if(typeof emitter === "function") {
                emitter(event, ...args);
            } else if(emitter instanceof Emitter) {
                emitter.$.asyncEmit(event, ...args);
            }
        }

        return this;
    }
};

export default Network;