import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import Context from "./Context";

export default class Channel extends EventEmitter {
    constructor(ctx) {
        super();
        
        this._id = uuidv4();
        this._subscription = null;

        this.watch(ctx);
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

    watch(ctx) {
        const fn = (state, ...args) => this.broadcast.call(this, ctx, state, ...args);  // @ctx is passed to identify which <Context> changed

        if(ctx instanceof Context) {
            ctx.on("update", fn);
            this._subscription = fn;
        } else {
            throw new Error("@subject must be a <Context>");
        }

        return this;
    }
    unwatch(ctx) {
        if(ctx instanceof Context) {
            ctx.off("update", this._subscription);
            this._subscription = null;
        } else {
            throw new Error("@subject must be a <Context>");
        }

        return this;
    }
    
    broadcast(ctx, state, ...args) {
        this.emit("broadcast", [ state, ...args ], ctx);
    }
};