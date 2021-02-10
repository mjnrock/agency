import { v4 as uuidv4 } from "uuid";
import Context from "./Context";

/**
 * The <Observer> role is singular in purpose: execute all of its effects whenever the <Context> emits an "update" event.
 *      The <Observer> is meant to be an abstract of "effects" that would otherwise be an internal property of <Context>
 *      that would be executed whenever .run(...) is invoked.  This keeps it subscription-based and asynchronous.
 */
export default class Observer {
    constructor(ctx, ...effects) {
        this._id = uuidv4();
        this._effects = new Set(effects);

        this.__meta = {
            context: ctx,
            subscription: null,
        };

        if(ctx) {
            this.__meta.subscription = this.watch(ctx);
        }

        return this;
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
        if(ctx instanceof Context) {
            const fn = (...args) => this.run.call(this, ctx || this.__meta.context, ...args);

            ctx.on("update", fn);

            this.__meta.context = ctx;
            this.__meta.subscription = fn;
        }

        return this;
    }
    unwatch(ctx) {
        if(ctx instanceof Context) {
            ctx.off("update", this.__meta.subscription);

            this.__meta.context = null;
            this.__meta.subscription = null;
        }

        return this;
    }
    
    run(ctx, ...args) {
        return new Promise((resolve, reject) => {
            for(let effect of this._effects) {
                if(typeof effect === "function") {
                    effect(...args);
                }
            }

            resolve(ctx, ...args);
        });
    }
};