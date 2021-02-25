import Context from "./Context";

export default class Channel extends Context {
    constructor(...subjects) {
        super({
            subjects: new Map(),
        });

        this.add(...subjects);
    }
    
    add(...subjects) {
        return this.watch("update", ...subjects);
    }
    remove(...subjects) {
        return this.unwatch("update", ...subjects);
    }

    watch(type, ...subjects) {
        for(let subject of subjects) {
            const fn = (...args) => this.broadcast.call(this, subject, type, ...args);

            subject.on(type, fn);

            this._state.subjects.set(subject, [ subject, fn ]);
        }

        return this;
    }
    unwatch(type, ...subjects) {
        for(let subject of subjects) {
            subject.off(type, this._state.subjects.get(subject).pop());

            this._state.subjects.delete(subject);
        }

        return this;
    }

    subscribe(...subscribers) {
        for(let subscriber of subscribers) {
            if(typeof subscriber === "function") {
                this.on("broadcast", subscriber);
            }
        }

        return this._subscribers;
    }
    unsubscribe(...subscribers) {
        for(let subscriber of subscribers) {
            if(typeof subscriber === "function") {
                this.off("broadcast", subscriber);
            }
        }

        return this._subscribers;
    }

    broadcast(...args) {
        this.emit("broadcast", ...args);
    }
};