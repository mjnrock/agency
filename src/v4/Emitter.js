import Watchable from "./Watchable";

export class Emitter extends Watchable {
    static Handler = (...args) => args;

    constructor(events = {}, { state = {}, deep = false, namespace = "", ...rest } = {}) {
        super(state, { deep, ...rest });

        if(Array.isArray(events)) {
            this.__events = {};

            for(let event of events) {
                this.$.handle(event);
            }
        } else {
            this.__events = events;
        }

        this.__namespace = namespace;
        return new Proxy(this, {
            get(target, prop) {
                if(prop[ 0 ] === "$" && prop.length > 1) {
                    let key = prop.slice(1);

                    if(key in target.__events) {
                        const nkey = target.__namespace ?  `${ target.__namespace }.${ key }` : key;

                        return async (...args) => target.$.broadcast(nkey, target.__events[ key ](...args));
                    }

                    return () => void 0;
                }

                return target[ prop ];
            }
        });
    }

    get $() {
        const _this = this;

        return {
            ...super.$,

            get namespace() {
                return _this.__namespace;
            },

            add(event, emitter) {
                if(typeof emitter === "function") {
                    _this.__events[ event ] = emitter;
                }
            },
            remove(event) {
                delete _this[ event ];
            },

            handle(event) {
                _this.__events[ event ] = Emitter.Handler;
            },

            async emit(event, ...args) {
                const fn = _this.__events[ event ];

                if(typeof fn === "function") {
                    const nkey = _this.__namespace ?  `${ _this.__namespace }.${ event }` : event;

                    _this.$.broadcast(nkey, fn(...args));
                }

                return this;
            },
        };
    }
};

export default Emitter;