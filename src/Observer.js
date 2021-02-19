import { v4 as uuidv4 } from "uuid";
import Context from "./Context";

export default class Observer {
    constructor(ctx, ...effects) {        
        this._id = uuidv4();
        this._effects = new Set(effects);

        this.watch(ctx);
    }

    /**
     * Add an effect function to the <Context>
     */
    add(...effects) {
        this._effects = new Set([
            ...this._effects,
            ...effects,
        ]);

        return this._effects;
    }
    /**
     * Remove an effect function to the <Context>
     */
    remove(...effects) {
        for(let effect of effects) {
            this._effects.delete(effect);
        }

        return this._effects;
    }

    watch(ctx) {
        const fn = (...args) => this.run.call(this, ctx, ...args);

        if(ctx instanceof Context) {
            ctx.on("update", fn);
            this.__subscription = fn;
        } else {
            throw new Error("@subject must be a <Context>");
        }

        return this;
    }
    unwatch(ctx) {
        if(ctx instanceof Context) {
            ctx.off("update", this.__subscription);
            delete this.__subscription;
        } else {
            throw new Error("@subject must be a <Context>");
        }

        return this;
    }
    
    run(ctx, ...args) {
        return new Promise((resolve, reject) => {
            for(let effect of this._effects) {
                if(typeof effect === "function") {
                    effect.call(ctx, ...args);
                }
            }

            resolve(ctx, ...args);
        });
    }
};