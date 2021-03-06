import { v4 as uuidv4 } from "uuid";

import AgencyBase from "./../AgencyBase";

import MessageBus from "./MessageBus";
import Dispatcher from "./Dispatcher";
import Receiver from "./Receiver";
import Channel from "./Channel";
import Message from "./Message";
import Watchable from "./watchable/Watchable";
import Controller from "./Controller";

/**
 * 
 * 1) Create <Network>
 * 2) Invoke << .addListener >> on any entity that should become aware of state changes
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
        this.__state = new Watchable(state, {
			network: this,
			useControlMessages: true,
		});

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
    get $() {
        return this.state;
    }
    set state(state) {
        let oldState = this.__state.toObject(),
            newState = Object.assign({}, state);

        this.__state.$set = state;

        this.__bus.emit(this, Network.Signal.UPDATE, newState, oldState);
    }

    [ Symbol.iterator ]() {
        var index = -1;
        var data = Object.entries(this.state);

        return {
            next: () => ({ value: data[ ++index ], done: !(index in data) })
        };
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

			channel.parseHandlerObject(entries);
        }

        return this;
    }

    /**
	 * Add a listener to receive << .broadcast >> messages
	 * 
     * @addSelfToDefaultGlobal | Add << this >> to default channel globals via { [ addSelfToDefaultGlobal ]: this }
     *      As such, whatever string value is passed will be used as the key
     */
    addListener(entity, { callback, filter, addToDefaultGlobal = false } = {}) {
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

		if(entity instanceof Watchable) {
			entity.__controller.network = cache.controller;
		}
        
        return cache.controller;
    }	
    /**
	 * Remove a listener to stop receiving << .broadcast >> messages
	 */
    removeListener(entity) {
        return this.__connections.delete(entity);
    }

	/**
	 * This is a "reverse" of << .addListener >>
	 */
	tuneIn(network, opts) {
		if(network instanceof Network) {
			return network.addListener(this, opts);
		}
	}
	/**
	 * This is a "reverse" of << .removeListener >>
	 */
	tuneOut(network) {
		if(network instanceof Network) {
			return network.removeListener(this);
		}
	}


    /**
     * Create and route a message normally.
     */
    message(type, ...args) {
        this.__bus.emit(this, type, ...args);
    }
	/**
	 * Route a <MessageCollection>
	 */
	collection(messages, middleware) {
		for(let msg of messages) {
			if(typeof middleware === "function") {
				msg = middleware(msg) || msg;
			}

			this.message(msg);
		}
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
    sendToChannel(channel, msg) {
        if(channel instanceof Channel) {
            channel.bus(msg);
        } else {
            this.__bus.channels[ channel ].bus(msg);
        }
    }
    /**
     * Pass a message to all channels, with optional exclulsions.
     */
    sendToAllChannels(msg, exclude = []) {
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
     * This will retrieve the cache controller object generated by << .addListener >>,
     *  as an alternative to saving the return value.
     */
    ctrl(entity) {
        const cache = this.__connections.get(entity) || {};

        return cache.controller || {};
    }
	
    __createCacheObject(entity, callback, filter) {
        const cache = {
            dispatcher: new Dispatcher(this, entity),
            receiver: new Receiver(callback, filter || (msg => msg.emitter !== entity)),
			controller: {},
        };

		cache.controller = new Controller(this, entity, cache);

        return cache;
    }
    __emptyJoin(entity, opts = {}) {
        if(entity instanceof Network) {
            return this.addListener(entity, {
                ...opts,
                callback: entity.__bus.receive.bind(entity.__bus),
            });
        }

		let finalEntity = typeof entity === "object" ? entity : {
			id: uuidv4(),
			value: entity,
		};
        return this.addListener(finalEntity, {
            callback: () => {},
        });
    }
};

export default Network;