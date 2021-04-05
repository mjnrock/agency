import Registry from "../Registry";
import Context from "./Context";
import Router from "./Router";

export class Network extends Registry {
    /**
     * For single-network usage, accessing the static $ property
     *      will create a "default" network automatically, if one does
     *      not exist with the synonym "default".  As such, a generic,
     *      default network can always be referenced via $.
     * 
     * In order to properly utilize a multi-network system, overwrite
     *      the << Network.Middleware >> method to introduce qualifying
     *      behavior that will appropriately register each newly
     *      instantiated <Emitter> to its appropriate <Network>.
     * 
     * NOTE:    By default, the << Emitter.$ >> global will join the default
     *      <Network>, and as such, there will always be a global <Emitter>
     *      that can be used for whatever purpose.  If this is problematic,
     *      invoke << Network.Recreate(); >> before any meaningful additions.
     *      This will recreate the default <Network> and thus drop the <Emitter>.
     */
    static Instances = new Registry();
    static Middleware = emitter => Network.$.join(emitter);

    constructor() {
        super();
        
        // store the modified routing functions for all member <Emitter(s)> so that leaving can properly clean them up
        this.cache = new WeakMap();
        // create event routing contexts with qualifier functions to in/exclude events
        this.router = new Router();
    }

    share(nameOrContext, payload, ...args) {
        const context = this.router[ nameOrContext ];

        if(context instanceof Context) {
            context.bus(payload, ...args);
        }

        return this;
    }

    /**
     * This will register the <Emitter> with the <Network>,
     *  create a routing function, and subscriber that function
     *  to the <Emitter>.  That function routes *all* events to
     *  the <Router>, where you can create routes to handle them.
     */
    join(...emitters) {
        for(let emitter of emitters) {
            this.register(emitter);

            const _this = this;
            const fn = function(...args) {
                _this.route(this, ...args);
            };

            this.cache.set(emitter, fn);

            emitter.addSubscriber(fn);
        }

        return this;
    }
    /**
     * This undoes and cleans up everything that .join does
     */
    leave(...emitters) {
        for(let emitter of emitters) {
            const fn = this.cache.get(emitter);

            emitter.removeSubscriber(fn);
            this.unregister(emitter);
        }

        return this;
    }

    /**
     * Route a .emit or .asyncEmit event from <Emitter>
     *  to the routing system
     */
    route(payload, ...args) {
        this.router.route(payload, ...args);
    }

    /**
     * Invoke << .process >> on all <Context(s)>
     */
    processAll() {
        this.router.process();
    }
    
    /**
     * Cause every <Emitter> member of the <Network> to
     *  invoke an event via << Emitter.$.emit >>
     */
    fire(event, ...args) {
        for(let emitter of this) {
            emitter.$.emit(event, ...args);
        }

        return this;
    }
    /**
     * Cause every <Emitter> member of the <Network> to
     *  invoke an async event via << Emitter.$.asyncEmit >>
     */
    async asyncFire(event, ...args) {
        for(let emitter of this) {
            emitter.$.asyncEmit(event, ...args);
        }

        return this;
    }

    /**
     * A convenience getter to easily access a default <Network>
     *  when a multi-network setup is unnecessary.
     */
    static get $() {
        if(!(Network.Instances || {}).default) {
            Network.Recreate();
        }

        return Network.Instances.default;
    }
    
    /**
     * Recreate the .Instances registry with optional seeding
     */
    static Recreate(networks = [], createDefault = true) {
        Network.Instances = new Registry({ Registry: { entries: networks }});

        if(createDefault) {
            Network.Instances.register(new Network(), "default");
        }
    }
};

export default Network;