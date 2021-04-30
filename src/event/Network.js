import { v4 as uuidv4 } from "uuid";

import Registry from "../Registry";
import Context from "./Context";
import Emitter from "./Emitter";
import Router from "./Router";

export class Network extends Registry {
    static Instances = new Registry();

    constructor(contexts = [], routes = [], connections = []) {
        super();
        
        // allow the <Network> to broadcast messages to other connected <Network(s)>
        this.connections = new Set(connections);    //? Connect children to parents for a hierarchy

        // store the modified routing functions for all member <Emitter(s)> so that leaving can properly clean them up
        this.cache = new WeakMap();
        // create event routing contexts with qualifier functions to in/exclude events
        this.router = new Router(contexts, routes);
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
        try {
            payload.provenance.add(this);
        } catch(e) {}

        this.router.route(payload);

        return this;
    }
    /**
     * Create and route an event with specified @emitter
     */
    emit(emitter, event, ...args) {
        this.route({
            id: uuidv4(),
            type: event,
            data: args,
            emitter: emitter,
            provenance: new Set([ emitter ]),
        });

        return this;
    }

    /**
     * Create and/or route an event to all << .connections >>
     *  attached to the <Network>.  If @emitter looks like
     *  a payload and args.length === 1, @emitter will
     *  be sent via << .route >>, instead of << .emit >>.
     */
    broadcast(emitter, event, ...args) {
        for(let connection of this.connections) {
            if(connection instanceof Network) {
                if(arguments.length === 1 && typeof emitter === "object" && "type" in emitter) {
                    connection.route(emitter);
                } else {
                    connection.emit(emitter, event, ...args);
                }
            }
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
     * Connect <Network(s)> for use with << .broadcast >>
     */
    link(...networks) {
        for(let network of networks) {
            this.connections.add(network);
        }

        return this;
    }
    /**
     * Disconnect <Network(s)>
     */
    unlink(...networks) {
        for(let network of networks) {
            this.connections.delete(network);
        }
        
        return this;
    }
    /**
     * Link << this >> from @network and vice-versa.
     */
    dualLink(...networks) {
        for(let network of networks) {
            this.connections.add(network);
            network.connections.add(this);
        }

        return this;
    }
    /**
     * Unlink << this >> from @network and vice-versa.
     */
    dualUnlink(...networks) {
        for(let network of networks) {
            this.connections.delete(network);
            network.connections.delete(this);
        }
        
        return this;
    }


    /**
     * Send the payload to another <Context> directly (i.e. bypass route)
     */
    sendToContext(nameOrContext, payload) {
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
                await emitter.$.asyncEmit(event, ...args);
            }
        }

        return Promise.resolve(this);
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

    static Register(...names) {
        for(let name of names) {
            Network.Instances.register(new Network(), name);
        }
    }
    static Unregister(...names) {
        for(let name of names) {
            Network.Instances.unregister(name);
        }
    }

    static BasicNetwork(handlers = {}, opts = {}) {
        return new BasicNetwork(handlers, opts);
    }
};

/**
 * Create a "default", single-context <Network>, that processes in **real-time**
 * @args <Context> constructor args
 * @name The name of the created <Context> in this.router
 */
export class BasicNetwork extends Network {
    static Relay = (network) => function(...args) {
        network.broadcast(this);
    }

    constructor(handlers = {}, { name = "default", useBatch = false, ...rest } = {}) {
        super();

        for(let [ key, value ] of Object.entries(handlers)) {
            if(value === BasicNetwork.Relay) {
                handlers[ key ] = value(this);
            }
        }
    
        this.router.createContext(name, { handlers, ...rest });
        this.router.createRoute(() => name);

        if(useBatch === false) {
            this.router.useRealTimeProcess();
        }
    }
}

export default Network;