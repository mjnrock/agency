export default class Context {
    constructor(name, { state = {}, nodes = [] } = {}) {
        this.name = name;
        this.state = state;
        this.nodes = nodes;

        return this;
    }

    add(...nodes) {
        this.nodes = new Set([
            ...this.nodes,
            ...nodes,
        ]);

        return this.nodes;
    }
    remove(...nodes) {
        for(let node of nodes) {
            this.nodes.delete(node);
        }

        return this.nodes;
    }

    broadcast(event, payload) {
        for(let node of this.nodes) {
            node.
        }
    }
};