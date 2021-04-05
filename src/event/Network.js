import Registry from "../Registry";
import Emitter from "./Emitter";
import Router from "./Router";

export class Network extends Registry {
    static Instance = new Network();
    static Middleware = emitter => Network.$.join(emitter);

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

    static get $() {
        if(!Network.Instance) {
            Network.Instance = new Network();
        }

        return Network.Instance;
    }
    
    static Reassign(...args) {
        Network.Instance = new Network(...args);
    }

    static Route(...args) {
        Network.$.router.route(this, ...args);     // @this should resolve to the payload here, based on <Emitter> behavior
    }
};

export default Network;