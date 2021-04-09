export const $Edge = $super => class extends $super {
    constructor({ Edge = {}, ...rest } = {}) {
        super({ ...rest });

        this.nodes = new Set(Edge.nodes || []);
        this.state = Edge.state || {};
    }

    request(requester, data) {
        for(let node of this.nodes) {
            requester.response(node.respond(this.state));
        }
    }
    respond(data, callback) {
        callback(data);
    }
};

export default $Edge;