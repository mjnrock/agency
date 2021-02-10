import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";

export default class Context extends EventEmitter {
    constructor(name, { state = {}, reducers = [], nodes = [] } = {}) {
        super();

        this._id = uuidv4();
        this._reducers = new Set(reducers);

        this.name = name;
        this.state = state;
        this.nodes = nodes;

        return this;
    }

    /**
     * Add a Node to the <Context>
     */
    attach(...nodes) {
        for(let node of nodes) {
            this.nodes.push(node);
        }

        return this.nodes;
    }
    /**
     * Remove a Node from the <Context>
     */
    detach(...nodes) {
        for(let node of nodes) {
            this.nodes.delete(node);
        }

        return this.nodes;
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
        for(let node of this.nodes) {
            const result = node.run(...args);

            if(exclude === null || !(typeof exclude === "function" && exclude(node, result, ...args) === true)) {
                if(result === true && this._reducers.size) {
                    for(let reducer of this._reducers) {
                        if(typeof reducer === "function") {
                            this.state = reducer(this.state, ...reducerArgs);
                        }
                    }
    
                    const txid = uuidv4();
                    this.emit("update", this.state, txid);
                    setTimeout(() => this.emit("hash", txid, hash(this.state)));

                    return true;
                }
            }
        }

        return false;
    }
};