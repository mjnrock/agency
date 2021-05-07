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
    };

    constructor(state = {}) {
        super();

        this.__bus = new MessageBus([ "_private" ], [ message => message.type === Network.Signals.UPDATE ? "_private" : null ]);
        this.__bus.channels._private.globals.broadcast = this.broadcast.bind(this);
        this.__bus.channels._private.addHandler(Network.Signals.UPDATE, function([], { broadcast }) { broadcast(Message.Generate(this)) });

        this.__connections = new Registry();
        this.__cache = new WeakMap();

        this.__state = state;
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

    _emptyJoin() {
        return this.join({
            id: uuidv4(),
        });
    }
    join(entity, { callback, synonyms = [] } = {}) {
        if(!arguments.length) {
            return this._emptyJoin();
        }

        this.__connections.register(entity, ...synonyms);

        const cache = {
            dispatcher: new Dispatcher(this, entity),
            callback,
            synonyms,
        };
        this.__cache.set(entity, cache);
        
        return {
            dispatch: cache.dispatcher.dispatch,
        };
    }
    leave(entity) {
        this.__connections.unregister(entity);

        return this.__cache.delete(entity);
    }

    broadcast(message) {
        for(let member of this.__connections) {
            let { callback } = this.__cache.get(member);

            if(typeof callback === "function") {
                callback(message);
            }
        }
    }
};

export default Network;