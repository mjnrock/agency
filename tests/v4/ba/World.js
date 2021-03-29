import { v4 as uuidv4 } from "uuid";

import Watcher from "../../../src/v4/Watcher";
import Network from "../../../src/v4/Network";
import EntityManager from "./EntityManager";
import Node from "./Node";
import NodeManager from "./NodeManager";
import Portal from "./Portal";

export class World extends Watcher {
    static Events = [
        "join",
        "leave",
    ];

    constructor(size = [], { entities = [], portals = [], namespace, config = {} } = {}) {
        super([], { events: World.Events, namespace });

        this.id = uuidv4();
        
        this.size = size;
        this._nodes = new NodeManager(this.size, { namespace });

        // this._entities = new EntityManager(entities);
        this._entities = new Network(entities);

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
    }

    get nodes() {
        return this._nodes;
    }
    get entities() {
        return this._entities.emitters;
    }
    get subnodes() {
        return this._nodes.nodes;
    }
    get overworld() {
        return this._overworld;
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

    join(entity, ...synonyms) {
        // this._entities.register(entity, ...synonyms);
        this._entities.join(entity, ...synonyms)

        this._nodes.move(entity);

        this.$join(this, entity);
        // entity, this.entities)
        
        return this;
    }
    leave(entity) {
        // this._entities.unregister(entity);
        this._entities.join(entity);

        if(this._nodes.remove(entity)) {
            this.$leave(this, entity);

            return true;
        }

        return false;
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


    setSpawnPoint(...pos) {
        this._config.spawn = pos;

        return this;
    }
}

export default World;