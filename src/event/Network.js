import Emitter from "./Emitter";

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

    onEvent(event, ...args) {
        console.log(event, ...args);
    }
};

export default Network;