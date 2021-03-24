import Watchable from "./Watchable";

export class Emitter extends Watchable {
    constructor(events = {}, { failSilently = true } = {}) {
        super();

        this.__events = events;

        return new Proxy(this, {
            get(target, prop) {
                if(prop[ 0 ] === "$" && prop.length > 1) {
                    const key = prop.slice(1);

                    if(key in target.__events) {
                        return async (...args) => target.$.broadcast(key, target.__events[ key ](...args));
                    }

                    if(failSilently) {
                        return () => void 0;
                    }
                }

                return target[ prop ];
            }
        })
    }

    get $() {
        const _this = this;

        return {
            ...super.$,

            add(event, emitter) {
                if(typeof emitter === "function") {
                    _this.__events[ event ] = emitter;
                }
            },
            remove(event) {
                delete _this[ event ];
            },

            async emit(event, ...args) {
                const fn = _this.__events[ event ];

                if(typeof fn === "function") {
                    _this.$.broadcast(event, fn(...args));
                }

                return this;
            },
        };
    }
};

export default Emitter;