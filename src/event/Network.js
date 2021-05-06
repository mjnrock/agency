import { v4 as uuidv4 } from "uuid";

import Registry from "../Registry";
import Channel from "./Channel";
import Dispatcher from "./Dispatcher";
import Router from "./Router";

/**
 * In a network, <Channel> instances have an associated internal state.
 *  If a either updates its state, it will emit an UPDATE event.  State
 *  events are intended to be fired by other handlers acting as reducers
 *  and invoking the << setState|mergeState >> commands.
 * 
 * If a state event has a <Channel> emitter, then the network's <Router>
 *  will short-circuit the route and pass the message to that <Channel>
 *  directly for handling, if any further action is necessary (i.e. effects).
 *  [WARNING]: This happens by invoking << payload.emitter.bus >>, NOT by
 *  a channel lookup, as in the normal routing scenario.
 */
export class Network extends Registry {
    static Instances = new Registry();

    constructor(channels = [], routes = [], { connections = [] } = {}) {
        super();
        
        // allow the <Network> to broadcast messages to other connected <Network(s)>
        this.connections = new Set(connections);    //? e.g. Connect children to parents for a hierarchy
        // create event routing channels with qualifier functions to in/exclude events
        this.router = new Router(this, channels, routes);
    }


    /**
     * Invoke << .process >> on all <Channel(s)>
     */
    processAll() {
        this.router.process();
    }
    /**
     * Invoke << .drop >> on all <Channel(s)>
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
            timestamp: Date.now(),
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
     * Join the <Network>, wrapping and returning a map
     *  of the emitters and dispatchers.  If a <Dispatcher>
     *  is passed, << this >> will be assigned to its << .network >>
     */
    join(subject, ...synonyms) {
        let dispatcher;
        if(subject instanceof Dispatcher) {
            subject.network = this;
            dispatcher = subject;
        } else if(typeof subject === "object") {
            dispatcher = new Dispatcher(this, subject);
        } else {
            return false;
        }

        this.register(dispatcher, ...synonyms);

        return dispatcher;
    }
    joinMany(joinArgs = []) {
        let dispatchers = new Map();

        for(let [ subject, ...synonyms ] of joinArgs) {
            dispatchers.set(subject, this.join(subject, ...synonyms));
        }

        return dispatchers;
    }
    
    /**
     * This undoes and cleans up everything that .join does
     */
    leave(...dispatchers) {
        for(let dispatcher of dispatchers) {
            if(dispatcher instanceof Dispatcher) {
                this.unregister(dispatcher);
            } else {
                let subject = dispatcher,
                    result;

                if(this.has(subject, (entry, value) => {
                    if(entry === value.subject) {
                        result = value;

                        return true;
                    }

                    return false;
                })) {
                    this.unregister(result);
                }
            }
        }

        return this;
    }

    /**
     * Cause every <Dispatcher> member of the <Network> to
     *  invoke the << @command >> network function.
     * 
     * @param command 'dispatch'|'broadcast'
     */
    fire(event, args = [], command = "dispatch") {
        for(let dispatcher of this) {
            if(dispatcher instanceof Dispatcher) {
                dispatcher[ command ](event, ...args);
            }
        }

        return this;
    }


    //  Convenience functions to more easily access <Channel> state management functions
    channel(channel = "default") {
        return this.router[ channel ];
    }
    getState(channel = "default") {
        const ctx = this.channel(channel);

        if(ctx instanceof Channel) {
            return ctx.getState();
        }
    }
    setState(channel = "default", state = {}, isMerge = false) {
        const ctx = this.channel(channel);

        if(ctx instanceof Channel) {
            return ctx.setState(state, isMerge);
        }
    }
    mergeState(channel = "default", state = {}) {
        const ctx = this.channel(channel);

        if(ctx instanceof Channel) {
            return ctx.mergeState(state);
        }
    }

    storeGlobal(channelName, name, value) {
        if(typeof name === "object") {
            this.router[ channelName ].globals = {
                ...this.router[ channelName ].globals,
                ...name,
            };
        } else {
            this.router[ channelName ].globals[ name ] = value;
        }

        return this;
    }
    unstoreGlobal(channelName, input) {
        if(Array.isArray(input)) {
            for(let key of input) {
                delete this.router[ channelName ].globals[ key ];
            }
        } else {
            delete this.router[ channelName ].globals[ input ];
        }

        return this;
    }


    static $(name = "default") {
        if(name === "default" && !Network.Instances[ name ]) {
            Network.Instances[ name ] = new BasicNetwork();
        }
        
        return Network.Instances[ name ];
    }

    /**
     * A convenience factory method for <BasicNetwork>
     */
    static SimpleSetup(handlers = {}, opts = {}) {
        return new BasicNetwork(handlers, opts);
    }
};

/**
 * Create a "default", single-channel <Network>, that processes in **real-time**
 * @args <Channel> constructor args
 * @name The name of the created <Channel> in this.router
 */
export class BasicNetwork extends Network {
    static Relay = (network) => function(...args) {
        network.broadcast(this);
    }

    constructor(handlers = {}, { channelName = "default", useBatch = false, ...rest } = {}) {
        super();

        for(let [ key, value ] of Object.entries(handlers)) {
            if(value === BasicNetwork.Relay) {
                handlers[ key ] = value(this);
            }
        }
    
        this.router.createChannel(channelName, { handlers, ...rest });
        this.router.createRoute(() => channelName);

        if(useBatch === true) {
            this.router.useBatchProcess();
        } else {
            this.router.useRealTimeProcess();
        }
    }

    storeGlobal(name, key, { channelName = "default" } = {}) {
        return super.storeGlobal(channelName, name, key);
    }
    unstoreGlobal(name, key, { channelName = "default" } = {}) {
        return super.unstoreGlobal(channelName, name, key);
    }
};

export default Network;