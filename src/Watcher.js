import Watchable from "./Watchable";

export class Watcher extends Watchable {
    constructor(watchables = [], state = {}, opts = {}) {
        super(state, opts);

        for(let watchable of watchables) {
            watchable.$.subscribe(this);
        }
    }

    get $() {
        const _this = this;

        return {
            ...super.$,

            async emit(prop, value) {
                for(let subscriber of _this.__subscribers.values()) {
                    const payload = {
                        prop,
                        value,
                        subject: this.subject,
                        observer: this.observer || this.subscriber,
                        emitter: _this,
                        subscriber,
                    };
        
                    if(typeof subscriber === "function") {
                        subscriber.call(payload, prop, value);
                    } else if(subscriber instanceof Watchable) {
                        subscriber.$.emit.call(payload, prop, value);
                    }
                }
        
                return _this;
            },
        };
    }
};

export default Watcher;