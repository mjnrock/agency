export const $Edge = $super => class extends $super {
    constructor({ Edge = {}, ...rest } = {}) {
        super({ ...rest });

        this.__nodes = new Set(Edge.nodes || []);
        this.__type = Edge.type;
        this.__state = Edge.state;
    }

    get nodes() {
        return this.__nodes;
    }
    get type() {
        return this.__type;
    }
    get state() {
        return this.__state;
    }

    request(requester, ...args) {
        for(let node of this.nodes) {
            requester.response(node.respond(this.state, ...args));
        }
    }
    respond(data, callback) {
        callback(data);
    }
};

export default $Edge;