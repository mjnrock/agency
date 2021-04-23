import { v4 as uuidv4 } from "uuid";

import Registry from "../Registry";
import Context from "./Context";
import Emitter from "./Emitter";
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
    static Cleanup = emitter => Network.$.leave(emitter);

    constructor() {
        super();
        
        // store the modified routing functions for all member <Emitter(s)> so that leaving can properly clean them up
        this.cache = new WeakMap();
        // create event routing contexts with qualifier functions to in/exclude events
        this.router = new Router();
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
     * Invoke << .process >> on all <Context(s)>
     */
    processAll() {
        this.router.process();
    }
    /**
     * Invoke << .drop >> on all <Context(s)>
     */
    emptyAll() {
        this.router.empty();
    }


    /**
     * Route a .emit or .asyncEmit event from <Emitter>
     *  to the routing system
     */
    route(payload) {
        this.router.route(payload);

        return this;
    }
    /**
     * Create and route an event with @emitter
     */
    emit(emitter, event, ...args) {
        this.route({
            id: uuidv4(),
            type: event,
            data: args,
            emitter: emitter,
            provenance: new Set(),
        });

        return this;
    }
    async asyncEmit(emitter, event, ...args) {
        return Promise.resolve(this.route({
            id: uuidv4(),
            type: event,
            data: args,
            emitter: emitter,
            provenance: new Set(),
        }));
    }

    /**
     * Send the payload to another <Context> directly (i.e. bypass route)
     */
    share(nameOrContext, payload) {
        const context = this.router[ nameOrContext ];

        if(context instanceof Context) {
            context.bus(payload);
        }

        return this;
    }
    
    /**
     * Cause every <Emitter> member of the <Network> to
     *  invoke an event via << Emitter.$.emit >>
     */
    fire(event, ...args) {
        for(let emitter of this) {
            if(emitter instanceof Emitter) {
                emitter.$.emit(event, ...args);
            }
        }

        return this;
    }
    /**
     * Cause every <Emitter> member of the <Network> to
     *  invoke an async event via << Emitter.$.asyncEmit >>
     */
    async asyncFire(event, ...args) {
        for(let emitter of this) {
            if(emitter instanceof Emitter) {
                emitter.$.asyncEmit(event, ...args);
            }
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
    static $$(networkIdOrSyn) {
        return Network.Instances[ networkIdOrSyn ];
    }
    
    /**
     * Recreate the .Instances registry with optional seeding
     */
    static Recreate(networks = [], createDefault = true) {
        Network.Instances = new Registry({ Registry: { entries: networks }});

        if(createDefault) {
            Network.Instances.register(new Network(), "agency");
            Network.Instances.register(new Network(), "default");
        }
    }

    static Create(...names) {
        for(let name of names) {
            Network.Instances.register(new Network(), name);
        }
    }
    static Destroy(...names) {
        for(let name of names) {
            Network.Instances.unregister(name);
        }
    }
};

export default Network;