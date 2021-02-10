import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";

export default class Context extends EventEmitter {
    constructor(name, { state = {}, reducers = [], nodes = [] } = {}) {
        super();

        this._id = uuidv4();
        this._name = name;
        this._state = state;
        this._reducers = new Set(reducers);
        this._nodes = nodes;

        return this;
    }

    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }

    /**
     * Add a Node to the <Context>
     */
    attach(...nodes) {
        for(let node of nodes) {
            this._nodes.push(node);
        }

        return this._nodes;
    }
    /**
     * Remove a Node from the <Context>
     */
    detach(...nodes) {
        for(let node of nodes) {
            this._nodes.delete(node);
        }

        return this._nodes;
    }
    /**
     * Find a Node (if present) by @_id and return the Node, if found
     */
    find(nodeId) {
        for(let node of nodes) {
            if(node._id === nodeId) {
                return node;
            }
        }
    }

    /**
     * Add a reducer function to the <Context>
     */
    add(...reducers) {
        this._reducers = new Set([
            ...this._reducers,
            ...reducers,
        ]);

        return this._reducers;
    }
    /**
     * Remove a reducer function to the <Context>
     */
    remove(...reducers) {
        for(let reducer of reducers) {
            this._reducers.delete(reducer);
        }

        return this._reducers;
    }

    /**
     * Run every Node passings destructured @args to each.  If any |true| exists, update the state.  Because the Nodes can have more logically-complex evaluators, <Context> only responds to |true|.
     */
    run(args = [], { reducerArgs = [], exclude = null } = {}) {
        for(let node of this._nodes) {
            const result = node.run(...args);

            if(exclude === null || !(typeof exclude === "function" && exclude(node, result, ...args) === true)) {
                if(result === true && this._reducers.size) {
                    for(let reducer of this._reducers) {
                        if(typeof reducer === "function") {
                            this._state = reducer(this._state, ...reducerArgs);
                        }
                    }
    
                    const txid = uuidv4();
                    this.emit("update", this._state, txid);
                    setTimeout(() => this.emit("hash", txid, hash(this._state)));

                    return true;
                }
            }
        }

        return false;
    }
};