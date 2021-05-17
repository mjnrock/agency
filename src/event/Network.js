import AgencyBase from "./../AgencyBase";

import MessageBus from "./MessageBus";
import Dispatcher from "./Dispatcher";
import Receiver from "./Receiver";
import Channel from "./Channel";
import Message from "./Message";

/**
 * 
 * 1) Create <Network>
 * 2) Invoke << .addConnection >> on any entity that should become aware of state changes
 * 3) Create a handler paradigm to invoke << .broadcast >> on Network.Signal.UPDATE
 */
export class Network extends AgencyBase {
    static Signal = {
        UPDATE: `Network:Update`,
        RELAY: `Network:Relay`,
    };

    constructor(state = {}, modify = {}) {
        super();

        this.__bus = new MessageBus();
        this.__connections = new Map();
        this.__state = state;

        this.modify({
            $routes: [
                message => "default",
            ],
            default: {
                [ Network.Signal.UPDATE ]: (msg, { broadcast }) => broadcast(msg),
                $globals: {
					network: this,
                    getState: () => this.state,
                    setState: state => this.state = state,
                    mergeState: (state = {}) => this.state = { ...this.state, ...state },
                    message: this.message.bind(this),
                    broadcast: this.broadcast.bind(this),
                },
            },
        });
        this.modify(modify);
    }

    get state() {
        return this.__state;
    }
    set state(state) {
        let oldState = Object.assign({}, this.__state),
            newState = Object.assign({}, state);

        this.__state = state;

        this.__bus.emit(this, Network.Signal.UPDATE, newState, oldState);
    }

    /**
     * A helper function to make broad changes to the network configuration
     *  within a single argument object.  This accepts new channel arguments,
     *  new route arguments, and removal arguments for both.
     * 
     * * COMMAND LIST
     * 
     * *) [ channelName ]: { ...handlers, $globals: { ... } }
     * *) $routes: [ ...fns ]
     * *) $channels: [ ...<Channel> ]
     * *) $delete: { routes: [ ...fns ], channels: [ ...name|<Channel> ] }
     * 
     * Example @obj:
     *  {
     *      [ "Cats" ]: { handlers: [ [ "cat", handlerCat ], ... ] },
     *      $routes: [ routeFn1, routeFn2 ],
     *      $delete: { channels: [ ChannelDog ] },
     *      ...
     *  }
     */
    modify(obj = {}) {
        if(obj.$routes) {
            this.__bus.router.createRoutes(obj.$routes);
            delete obj.$routes;
        }

        if(obj.$delete) {
            const { routes, channels } = obj.$delete;

            if(routes) {
                this.__bus.router.destroyRoutes(routes);
            }
    
            if(channels) {
                this.__bus.destroyChannels(channels);
            }

            delete obj.$delete;
        }

        if(obj.$channels && Array.isArray(obj.$channels)) {
            for(let channel of obj.$channels) {
                this.__bus.createChannel(channel);
            }

            delete obj.$channels;
        }

        for(let [ channelName, entries ] of Object.entries(obj)) {
            let channel = this.__bus.channels[ channelName ] || this.__bus.createChannel(channelName);

            for(let [ key, value ] of Object.entries(entries)) {
                if(key === "$globals") {
                    for(let [ name, val ] of Object.entries(value)) {
                        channel.globals[ name ] = val;
                    }
                } else {
                    channel.addHandler(key, value);
                }
            }
        }

        return this;
    }

    /**
     * @addSelfToDefaultGlobal | Add << this >> to default channel globals via { [ addSelfToDefaultGlobal ]: this }
     *      As such, whatever string value is passed will be used as the key
     */
    addConnection(entity, { callback, filter, addToDefaultGlobal = false } = {}) {
        if(!!entity && !callback) {
            return this.__emptyJoin(entity, { filter, addToDefaultGlobal });
        }

        
        const cache = this.__createCacheObject(entity, callback, filter);
        this.__connections.set(entity, cache);

        if((typeof addToDefaultGlobal === "string" || addToDefaultGlobal instanceof String) && entity instanceof Network) {
            entity.modify({
                default: {
                    $globals: {
                        [ addToDefaultGlobal ]: this,
                    }
                }
            });
        }
        
        return cache.controller;
    }
    removeConnection(entity) {
        return this.__connections.delete(entity);
    }
	join(network, opts) {
		if(network instanceof Network) {
			return network.addConnection(this, opts);
		}
	}
	leave(network) {
		if(network instanceof Network) {
			return network.removeConnection(this);
		}
	}


    /**
     * Create and route a message normally.
     */
    message(type, ...args) {
        this.__bus.emit(this, type, ...args);
    }
    /**
     * Send a message to all connections, invoking the callback
     *  function on each receiver.
     */
    broadcast(...args) {
        let message;
        if(args.length > 1) {
            message = Message.Generate(this, ...args);
        } else if(Message.ConformsBasic(args[ 0 ])) {
            [ message ] = args;
        } else {
            message = args;
        }

        for(let { receiver } of this.__connections.values()) {
            if(receiver instanceof Receiver) {
                receiver.receive(message);
            }
        }
    }
    

    /**
     * Pass a message from one channel to another.
     */
    pass(channel, msg) {
        if(channel instanceof Channel) {
            channel.bus(msg);
        } else {
            this.__bus.channels[ channel ].bus(msg);
        }
    }
    /**
     * Pass a message to all channels, with optional exclulsions.
     */
    multiPass(msg, exclude = []) {
        if(!Array.isArray(exclude)) {
            exclude = [ exclude ];
        }

        exclude = exclude.map(name => this.ch[ name ]);

        if(exclude.length) {
            for(let channel of this.ch) {
                if(!exclude.includes(channel)) {
                    channel.bus(msg);
                }
            }
        } else {
            for(let channel of this.ch) {
                channel.bus(msg);
            }
        }
    }

    /**
     * A shorthand getter for a "getChannel"-like function
     */
    ch(name) {
        return this.__bus.channels[ name ];
    }

    /**
     * This will retrieve the cache controller object generated by << .addConnection >>,
     *  as an alternative to saving the return value.
     */
    ctrl(entity) {
        const cache = this.__connections.get(entity) || {};

        return cache.controller || {};
    }

    /**
     * A helper function for when no other arguments are passed
     *  besides @entity.  This is used for situations where the
     *  callback/filter are seeded later.
     */
    __createReceiverFn(entity) {
        return ({ callback, filter } = {}) => {
            const data = this.__connections.get(entity);

            if(!data) {
                return -1;  // Cache record does not exist
            }
            
            let wasUpdated = false;
            if(typeof callback === "function") {
                data.receiver.__callback = callback;
                wasUpdated = true;
            }
            if(typeof filter === "function") {
                data.receiver.__filter = filter;
                wasUpdated = true;
            }

            if(wasUpdated) {
                this.__connections.set(entity, data);

                return true;
            }

            return false;
        };
    }
    __createCacheObject(entity, callback, filter) {
        const cache = {
            dispatcher: new Dispatcher(this, entity),
            receiver: new Receiver(callback, msg => msg.emitter !== entity),
            controller: {},
        };

        cache.controller = {
            dispatch: cache.dispatcher.dispatch,
            broadcast: cache.dispatcher.broadcast,
            receiver: this.__createReceiverFn(entity),
        };

        return cache;
    }
    __emptyJoin(entity, opts = {}) {
        if(entity instanceof Network) {
            return this.addConnection(entity, {
                ...opts,
                callback: entity.__bus.receive.bind(entity.__bus),
            });
        }

        return this.addConnection(entity, {
            callback: () => {},
        });
    }
};

export default Network;