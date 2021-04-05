import Registry from "../Registry";
import Emitter from "./Emitter";
import Router from "./Router";

export class Network extends Registry {
    constructor() {
        super();

        this.cache = new WeakMap();
        this.router = new Router();
    }

    join(...emitters) {
        for(let emitter of emitters) {
            if(emitter instanceof Emitter) {
                this.register(emitter);

                const _this = this;
                const fn = function(...args) {
                    _this.route(this, ...args);
                };

                this.cache.set(emitter, fn);

                emitter.addSubscriber(fn);
            }
        }

        return this;
    }
    leave(...emitters) {
        for(let emitter of emitters) {
            if(emitter instanceof Emitter) {
                const fn = this.cache.get(emitter);

                emitter.removeSubscriber(fn);
                this.unregister(emitter);
            }
        }

        return this;
    }

    route(payload, ...args) {
        this.router.route(payload, ...args);
    }
    
    fire(event, ...args) {
        for(let emitter of this) {
            if(emitter instanceof Emitter) {
                emitter.$.emit(event, ...args);
            }
        }

        return this;
    }
    async asyncFire(event, ...args) {
        for(let emitter of this) {
            if(emitter instanceof Emitter) {
                emitter.$.asyncEmit(event, ...args);
            }
        }

        return this;
    }
};

export default Network;