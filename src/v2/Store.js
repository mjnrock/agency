import fetch from "node-fetch";
import Observable from "./Observable";

export class Store extends Observable {
    constructor(state = {}, ...reducers) {
        super(false, { noWrap: true });

        this.__state = state;
        this.__reducers = new Set(reducers);
        
        return new Proxy(this, {
            get(target, prop) {
                if(prop in target.__state) {
                    return target.__state[ prop ];
                }

                return target[ prop ];
            },
            set(target, prop, value) {
                if(prop === "next") {
                    target.next = value;
                } else if(prop === "state" || (prop[ 0 ] === "_" && prop[ 1 ] === "_" )) {
                    target[ prop ] = value;
                }

                return this;
            }
        });
    }

    get state() {
        return this.toData();
    }
    set state(state) {
        if(this.__isProcessable !== true) {
            return this;
        }

        if(typeof state === "object") {
            const oldState = this.toData();
            this.__state = state;

            this.next("state", { current: this.state, previous: oldState });
        }

        return this;
    }

    addReducer(...reducers) {
        for(let reducer of reducers) {
            this.__reducers.add(reducer);
        }

        return this;
    }
    removeReducer(...reducers) {
        for(let reducer of reducers) {
            this.__reducers.delete(reducer);
        }

        return this;
    }

    dispatch(...args) {
        let state;
        for(let reducer of this.__reducers.values()) {
            state = reducer(state || this.__state, ...args) || state;
        }

        this.__isProcessable = true;
        this.state = state;
        delete this.__isProcessable;
        
        return this;
    }
    async fetchDispatch(url, opts = {}, ...dispatchArgs) {
        return fetch(url, opts).then(resp => resp.json()).then(data => this.dispatch(...dispatchArgs, data)).catch(e => e);
    }
    async promiseDispatch(promise, ...dispatchArgs) {
        return Promise.resolve(promise).then((...args) => this.dispatch(...dispatchArgs, ...args)).catch(e => e);
    }

    toData() {
        const obj = {};    
        for(let [ key, value ] of Object.entries(this.__state)) {
            if(key[ 0 ] !== "_" && key[ 1 ] !== "_") {
                if(value instanceof Observable) {
                    obj[ key ] = value.toData();
                } else {
                    obj[ key ] = value;
                }
            }
        }
    
        return obj;
    };
};

//? Use the .Factory method to create a <Store> with default state
export function Factory(state = {}, ...reducers) {
    return new Store(state, ...reducers);
};

/**
 * The type variable should be the first argument passed to .process
 */
export function TypedReducer(type, fn) {
    return (state, t, ...args) => {
        if(type === t) {
            return fn(state, ...args);
        }
    }
};

Store.Factory = Factory;
Store.TypedReducer = TypedReducer;

export default Store;