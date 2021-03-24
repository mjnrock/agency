import Watchable from "./Watchable";

export class Emitter extends Watchable {
    constructor(events = {}) {
        super();

        this.__events = events;

        return new Proxy(this, {
            get(target, prop) {
                if(prop.startsWith("$") && prop.length > 1) {
                    const key = prop.slice(1);

                    if(key in this.__events) {
                        return (...args) => target.$.broadcast(key, target.__events[ key ](...args))
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