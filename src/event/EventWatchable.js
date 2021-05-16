import Watchable from "./Watchable";

/**
 * This is a conduit through which an <EventEmitter> can emit
 *  any event and the event data will be stored in state
 *  with the event name as the key.
 * 
 *  (e.g. event = "test" --> { test: { ... } })
 */
export class EventWatchable extends Watchable {
    /**
     * The primary purpose of this class is to act as a state of record
     *  for a given set of events, recording (or relaying) them as they happen.
     *  By default, it records *one (1)* previous emission.  This can be overriden
     *  by overwriting << __record >>.
     * 
     * @network The Agency <Network> to join
     * @eventEmitter <EventEmitter> or object of similar shape
     * @events [ ...eventNames ]
     * @state ? A default <Watchable> state
     * @useAsRelayOnly ? Forego saving event data and instead forward the event directly to the network
     * @namespace ? Only used if acting as a relay
     * @middleware ? fn -> T|F that can interrupt propagation if it returns false, a mutator, utility fn, etc.
     * @useExistingFnAsMiddleware ? If true, any function bound to `on${ eventName }` will be used as that event's @middleware
     */
    constructor(network, eventEmitter, events = [], { state, namespace, useAsRelayOnly = false, middleware = {}, useExistingFnAsMiddleware = false, ...opts } = {}) {
        super(network, state, opts);

        this.__emitter = eventEmitter;
        this.__handlers = {};
        this.__middleware = middleware;

        this.__config = {
            namespace,
            useAsRelayOnly,
            useExistingFnAsMiddleware,
        };

        this.add(...events);

        return this;
    }

    __record(type, ...args) {        
        this[ type ] = {
            previous: {
                data: this[ type ].data,
                dt: this[ type ].dt,
                n: this[ type ].n,
            },
            data: args,
            dt: Date.now(),
            n: (this[ type ].n || 0) + 1,
        };
    }

    add(...eventNames) {
        if(Array.isArray(eventNames[ 0 ])) {    // "Single argument" assumption, overload
            eventNames = eventNames[ 0 ];
        }

        for(let eventName of eventNames) {
            this.__handlers[ eventName ] = (...args) => {
                if(typeof this.__middleware[ eventName ] === "function") {
                    const result = this.__middleware[ eventName ](...args);
                    
                    if(result === false) {
                        return false;
                    }
                }
                
                if(this.__config.useAsRelayOnly) {
                    let type = this.__config.namespace ? `${ this.__config.namespace }.${ eventName }` : eventName;
                    
                    this.__controller.controller.dispatch(type, ...args);
                } else {
                    if(this[ eventName ] === void 0) {
                        this[ eventName ] = {};
                    }

                    this.__record(eventName, ...args);
                }

                return true;
            }

            if(typeof this.__emitter.on === "function") {
                this.__emitter.on(eventName, this.__handlers[ eventName ]);
            } else if(typeof this.__emitter.addListener === "function") {
                this.__emitter.addListener(eventName, this.__handlers[ eventName ]);
            } else if(typeof this.__emitter.addEventListener === "function") {
                this.__emitter.addEventListener(eventName, this.__handlers[ eventName ]);
            } else if(`on${ eventName }` in this.__emitter) {
                if(this.__config.useExistingFnAsMiddleware && typeof this.__emitter[ `on${ eventName }` ] === "function") {
                    this.__middleware[ eventName ] = this.__emitter[ `on${ eventName }` ];
                }

                this.__emitter[ `on${ eventName }` ] = this.__handlers[ eventName ];
            }
        }

        return this;
    }
    remove(...eventNames) {
        if(Array.isArray(eventNames[ 0 ])) {    // "Single argument" assumption, overload
            eventNames = eventNames[ 0 ];
        }

        for(let eventName of eventNames) {
            if(typeof this.__emitter.off === "function") {
                this.__emitter.off(eventName, this.__handlers[ eventName ]);
            } else if(typeof this.__emitter.removeListener === "function") {
                this.__emitter.removeListener(eventName, this.__handlers[ eventName ]);
            } else if(typeof this.__emitter.removeEventListener === "function") {
                this.__emitter.removeEventListener(eventName, this.__handlers[ eventName ]);
            }
            
            delete this[ eventName ];
            delete this.__middleware[ eventName ];
            delete this.__handlers[ eventName ];
        }

        return this;
    }
}

export default EventWatchable;