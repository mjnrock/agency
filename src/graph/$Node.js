import Registry from "../Registry";

export const $Node = $super => class extends $super {
    constructor({ Node = {}, ...rest } = {}) {
        super({ ...rest });

        this.edges = new Registry({
            Registry: Node.Registry || {},
        });

        for(let [ key, value ] of Object.entries(Node)) {
            this[ key ] = value;
        }
    }

    request(data) {
        for(let edge of this.edges) {
            edge.request(this, data);
        }
    }
    respond(data) {
        return this;
    }
    response(node) {
        console.log(999, node);
    }
};

export default $Node;