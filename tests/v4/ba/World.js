import { v4 as uuidv4 } from "uuid";

import Emitter from "../../../src/v4/Emitter";
import Node from "./Node";
import NodeManager from "./NodeManager";
import Portal from "./Portal";

export class World {
    static Cost = function(node) { return node.terrain.terrain.cost; };

    constructor(size = [], { overworld, zones = [], entities = [], portals = [], namespace, config = {} } = {}) {
        // super([
        //     "join",
        //     "leave",
        // ], {}, { namespace, nestedProps: false });

        this.id = uuidv4();
        
        this.size = size;
        this._nodes = new NodeManager(this.size);
        this._zones = new Set();

        this._config = {
            ...config,

            spawn: config.spawn || [ 0, 0 ],
        };

        for(let [ x, y, portal ] of portals) {
            this.open(x, y, portal);
        }
        for(let entity of entities) {
            this.join(entity);
        }

        this._overworld = overworld;
        for(let zone of zones) {
            this.connect(zone);
        }
        // for(let [ zone, to, from ] of zones) {
        //     this.connect(zone, to, from);
        // }
    }

    get nodes() {
        return this._nodes;
    }
    get subnodes() {
        return this._nodes.nodes;
    }
    get overworld() {
        return this._overworld;
    }
    get zones() {
        return this._zones;
    }
    get config() {
        return this._config;
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
        const node = this.subnodes.get(x, y);

        if(node instanceof Node && portal instanceof Portal) {
            node.portals.add(portal);

            return true;
        }

        return false;
    }
    close(x, y, portal) {
        const node = this.subnodes.get(x, y);

        if(node instanceof Node && portal instanceof Portal) {
            node.portals.delete(portal);

            return true;
        }

        return false;
    }

    connect(zone) {
        zone._overworld = this;
        this.zones.add(zone);

        return this;
    }

    // connect(zone, trip = [], returnTrip = []) {
    //     if(zone instanceof World) {
    //         const portals = {};
    //         portals.to = new Portal(zone, { x: trip[ 2 ], y: trip[ 3 ] });

    //         this.open(trip[ 0 ], trip[ 1 ], portals.to);

    //         if(returnTrip.length) {
    //             portals.from = new Portal(this, { x: returnTrip[ 2 ], y: returnTrip[ 3 ] });

    //             zone.open(returnTrip[ 0 ], returnTrip[ 1 ], portals.from);
    //         }

    //         zone._overworld = this;
    //         this.zones.add(zone);

    //         return portals;
    //     }
    // }

    occupants(x, y) {
        const node = this.subnodes.get(x, y);

        if(node) {
            return node.occupants;
        }

        return [];
    }
    terrain(x, y) {
        const node = this.subnodes.get(x, y);

        if(node) {
            return node.terrain;
        }
    }
    portals(x, y) {
        const node = this.subnodes.get(x, y);

        if(node) {
            return node.portals;
        }
    }
    cost(x, y, extractor = World.Cost) {
        const node = this.subnodes.get(x, y);

        if(node) {
            return extractor(node);
        }

        return Infinity;
    }


    setSpawnPoint(...pos) {
        this._config.spawn = pos;

        return this;
    }
}

export default World;