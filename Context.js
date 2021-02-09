import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";

export default class Context {
    constructor(name, { state = {}, reducers = [], nodes = [] } = {}) {
        this._id = uuidv4();
        this._reducers = new Set(reducers);

        this.name = name;
        this.state = state;
        this.nodes = nodes;

        return this;
    }

    attach(...nodes) {
        this.nodes = new Set([
            ...this.nodes,
            ...nodes,
        ]);

        return this.nodes;
    }
    detach(...nodes) {
        for(let node of nodes) {
            this.nodes.delete(node);
        }

        return this.nodes;
    }
    find(nodeId) {
        for(let node of nodes) {
            if(node._id === nodeId) {
                return node;
            }
        }
    }

    add(...reducers) {
        this._reducers = new Set([
            ...this._reducers,
            ...reducers,
        ]);

        return this._reducers;
    }
    remove(...reducers) {
        for(let reducer of reducers) {
            this._reducers.delete(reducer);
        }

        return this._reducers;
    }

    run(...args) {
        for(let node of this.nodes) {
            const result = node.run(...args);

            if(result === true && this._reducers.length) {
                for(let reducer of this._reducers) {
                    if(typeof reducer === "function") {
                        this.state = reducer(this.state);
                    }
                }

                const txid = uuidv4();
                this.emit("update", this.state, txid);
                setTimeout(() => this.emit("hash", txid, hash(this.state)));
            }
        }
    }
};