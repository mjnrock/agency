import { v4 as uuidv4 } from "uuid";
import AgencyBase from "./../AgencyBase";

import Registry from "./../Registry";
import MessageBus from "./MessageBus";
import Dispatcher from "./Dispatcher";
import Receiver from "./Receiver";
import Message from "./Message";

/**
 * 
 * 1) Create <Network>
 * 2) Invoke << .join >> on any entity that should become aware of state changes
 * 3) Create a handler paradigm to invoke << .broadcast >> on Network.Signals.UPDATE
 */
export class Network extends AgencyBase {
    static Signals = {
        UPDATE: `Network.Update`,
        CONSUME: `Network.Consume`,
    };

    constructor(state = {}, modify = {}) {
        super();

        //TODO  The "_internal" channel is *NOT* actually private yet, and currently functions as a normal channel
        this.__bus = new MessageBus([ "_internal" ], [ message => message.type === Network.Signals.UPDATE ? "_internal" : null ]);
        this.__bus.channels._internal.globals.broadcast = this.broadcast.bind(this);
        this.__bus.channels._internal.addHandler(Network.Signals.UPDATE, function(msg, { broadcast }) { broadcast(Message.Generate(this)) });

        this.__connections = new Registry();
        this.__cache = new WeakMap();

        this.__state = state;

        this.alter(modify);
    }

    get state() {
        return this.__state;
    }
    set state(state) {
        let oldState = Object.assign({}, this.__state),
            newState = Object.assign({}, state);

        this.__state = state;

        this.__bus.emit(this, Network.Signals.UPDATE, newState, oldState);
    }

    /**
     * A helper function to make broad changes to the network configuration
     *  within a single argument object.  This accepts new channel arguments,
     *  new route arguments, and removal arguments for both.
     * 
     * * COMMAND LIST
     * 
     * *) [ channelName ]: { handlers, globals }
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
    alter(obj = {}) {
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

        for(let [ channelName, { globals = {}, handlers = {} } ] of Object.entries(obj)) {
            let channel = this.__bus.channels[ channelName ] || this.__bus.createChannel(channelName);

            for(let [ key, value ] of Object.entries(globals)) {
                channel.globals[ key ] = value;
            }
            for(let [ name, fn ] of Object.entries(handlers)) {
                channel.addHandler(name, fn);
            }
        }

        return this;
    }

    _emptyJoin() {
        return this.join({
            id: uuidv4(),
        });
    }
    join(entity, { callback, filter, synonyms = [] } = {}) {
        if(!arguments.length) {
            return this._emptyJoin();
        }

        this.__connections.register(entity, ...synonyms);

        const cache = {
            dispatcher: new Dispatcher(this, entity),
            receiver: new Receiver(callback, filter),
            synonyms,
        };
        this.__cache.set(entity, cache);
        
        return {
            dispatch: cache.dispatcher.dispatch,
            broadcast: cache.dispatcher.broadcast,
            receiver: ({ callback, filter } = {}) => {
                const data = this.__cache.get(entity);

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
                    this.__cache.set(entity, data);

                    return true;
                }

                return false;
            }
        };
    }
    leave(entity) {
        this.__connections.unregister(entity);

        return this.__cache.delete(entity);
    }

    emit(type, ...args) {
        this.__bus.emit(this, type, ...args);
    }
    consume(msg, globals = {}) {
        this.emit(Network.Signals.CONSUME, msg, globals);
    }

    broadcast(message) {
        for(let member of this.__connections) {
            let { receiver } = this.__cache.get(member);

            if(receiver instanceof Receiver) {
                receiver.receive(message);
            }
        }
    }
};

export default Network;