import { v4 as uuidv4 } from "uuid";
import Context from "./Context";
import Validator from "./Validator";

/**
 * The <Observer> role is to react to signals, whether that be a state change by <Context>, or an activation signal by <Validator>
 */
export default class Observer {
    constructor(subject, ...effects) {
        this._id = uuidv4();
        this._effects = new Set(effects);

        if(subject) {
            this.__subject = subject;
            this.__subscription = this.watch(subject);
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

    watch(subject) {
        const fn = (...args) => this.run.call(this, subject, ...args);

        if(subject instanceof Context) {
            subject.on("update", fn);
        } else if(subject instanceof Validator) {
            subject.on("activate", fn);
        } else {
            throw new Error("@subject must be a <Context> or <Validator>");
        }

        // Cleanup previous subject, if no .unwatch(...) invocation occurred
        if(this.__subject instanceof Context || this.__subject instanceof Validator) {
            this.unwatch(this.__subject);
        }

        this.__subject = subject;
        this.__subscription = fn;

        return this;
    }
    unwatch(subject) {
        if(subject instanceof Context) {
            subject.off("update", this.__subscription);
        } else if(subject instanceof Validator) {
            subject.off("activate", this.__subscription);
        } else {
            throw new Error("@subject must be a <Context> or <Validator>");
        }

        this.__subject = null;
        this.__subscription = null;

        return this;
    }
    
    run(subject, ...args) {
        return new Promise((resolve, reject) => {
            for(let effect of this._effects) {
                if(typeof effect === "function") {
                    effect.call(subject, ...args);
                }
            }

            resolve(subject, ...args);
        });
    }
};