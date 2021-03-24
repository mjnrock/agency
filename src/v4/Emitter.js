import Watchable from "./Watchable";

export class Emitter extends Watchable {
    constructor(events = {}) {
        super();

        this.__events = events;
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
                    _this.broadcast(event, fn(...args));
                }

                return this;
            }
        }
    }
};