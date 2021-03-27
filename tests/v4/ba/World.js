import Emitter from "../../../src/v4/Emitter";
import Node from "./Node";
import NodeManager from "./NodeManager";
import Portal from "./Portal";

export class World extends Emitter {
    constructor(size = [], { portals = [], namespace } = {}) {
        super([
            "join",
            "leave",
        ], {}, { namespace, nestedProps: false });
        this.size = size;
        this._nodes = new NodeManager(this.size);

        //STUB
        // this._nodes.$.on(
        //     namespace ? `${ namespace }.portal` : `portal`,
        //     ([ portal, entity ]) => console.log([ portal.x, portal.y ], entity.position),
        // );

        for(let [ x, y, portal ] of portals) {
            this.open(x, y, portal);
        }
    }

    get nodes() {
        return this._nodes.nodes;
    }

    get width() {
        return this.size[ 0 ];
    }
    get height() {
        return this.size[ 1 ];
    }
    get dim() {
        return dim => this.size[ dim ];
    }

    join(entity) {
        this._nodes.move(entity);
        
        return this;
    }
    leave(entity) {
        return this._nodes.remove(entity);
    }

    open(x, y, portal) {
        const node = this.nodes.get(x, y);

        if(node instanceof Node && portal instanceof Portal) {
            node.portals.add(portal);

            return true;
        }

        return false;
    }
    close(x, y, portal) {
        const node = this.nodes.get(x, y);

        if(node instanceof Node && portal instanceof Portal) {
            node.portals.delete(portal);

            return true;
        }

        return false;
    }
}

export default World;