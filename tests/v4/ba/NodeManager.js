import Watcher from "./../../../src/v4/Watcher";
import Util from "./../../../src/v4/util/package";
import Node from "./Node";

export class NodeManager extends Watcher {
    static Extractor = function(entity) { return [ entity.position.x, entity.position.y ] };
    static Cacher = function([ entity ]) { this.cache.set(entity,  [ entity.position.x, entity.position.y ]); };
    static Teleporter = function([ portal, entity ]) {
        if(entity.position.world) {
            entity.position.world.leave(entity);
        }

        entity.position.world = portal.world;
        portal.world.join(entity);
        
        entity.position.x = portal.x;
        entity.position.y = portal.y;
    };

    constructor(size = [ 1, 1 ], { extractor, cacher, teleporter, namespace, ...opts } = {}) {
        super([], { ...opts });

        this._cache = new WeakMap();
        
        //FIXME
        // this._nodes = Agency.Util.CrossMap.CreateGrid
        this._nodes = Util.CrossMap.CreateGrid([ ...size ], {
            seedFn: (...coords) => {
                const node = new Node(coords, {}, { namespace });

                this.$.watch(node);

                return node;
            },
        });
        this.$.on(
            Node.GetEvent(namespace, "join"),
            typeof cacher === "function" ? cacher.bind(this) : NodeManager.Cacher.bind(this),
        );
        this.$.on(
            Node.GetEvent(namespace, "portal"),
            typeof teleporter === "function" ? teleporter.bind(this) : NodeManager.Teleporter.bind(this),
        );

        // this.$.on(
        //     this.$.events.join,
        //     typeof cacher === "function" ? cacher.bind(this) : NodeManager.Cacher.bind(this),
        // );
        // this.$.on(
        //     this.$.events.portal,
        //     typeof teleporter === "function" ? teleporter.bind(this) : NodeManager.Teleporter.bind(this),
        // );

        this.__extractor = extractor;
    }

    get extractor() {
        if(typeof this.__extractor === "function") {
            return this.__extractor.bind(this);
        }
        
        return NodeManager.Extractor.bind(this);
    }
    get nodes() {
        return this._nodes;
    }
    get cache() {
        return this._cache;
    }

    cached(entity) {
        return this.cache.get(entity);
    }
    extract(entity) {
        return this.nodes.get(...this.extractor(entity));
    }

    move(entity) {
        const pos = this.cached(entity) || [];
        const leaveNode = this.node(...pos);
        const joinNode = this.extract(entity);

        if(leaveNode !== joinNode) {
            if(leaveNode instanceof Node) {
                leaveNode.leave(entity);
            }
            if(joinNode instanceof Node) {
                joinNode.join(entity);
            }
        }

        return this;
    }
    remove(entity) {
        const pos = this.cached(entity) || [];
        const cacheNode = this.node(...pos);
        const posNode = this.extract(entity);

        const leaver = node => node instanceof Node && node.leave(entity);

        if(cacheNode instanceof Node) {
            if(cacheNode.leave(entity)) {
                return true;
            } else if(posNode instanceof Node) {
                if(posNode.leave(entity)) {

                }
            }
        }

        if(leaver(cacheNode)) {
            return true;
        } else if(leaver(posNode)) {
            return true;
        }
        
        return this.findAndRemove(entity);
    }
    findAndRemove(entity) {
        const nodes = this.nodes.toLeaf({ flatten: true });
        for(let node of nodes) {
            if(node.leave(entity)) {
                return true;
            }
        }

        return false;
    }

    node(...pos) {
        //FIXME
        // return this._nodes.get(Helper.round(x, 1), Helper.round(y, 1));
        return this.nodes.get(...pos);
    }

    /**
     * If [@centered=true], then consider @w and @h as radii
     */
    range(x, y, w, h, { asGrid = false, centered = false } = {}) {
        const nodes = [];

        //FIXME
        // x = Helper.round(x, 1);
        // y = Helper.round(y, 1);

        if(centered) {  // Refactor values to become center point and radii
            x -= w;
            y -= h;
            w *= 2;
            h *= 2;
            w += 1;
            h += 1;
        }

        if(asGrid) {
            for(let j = y; j < y + h; j++) {
                let row = [];
                for(let i = x; i < x + w; i++) {
                    row.push(this.node(i, j));
                }

                nodes.push(row);
            }
        } else {
            for(let j = y; j < y + h; j++) {
                for(let i = x; i < x + w; i++) {
                    nodes.push(this.node(i, j));
                }
            }
        }        

        return nodes;
    }
}

export default NodeManager;