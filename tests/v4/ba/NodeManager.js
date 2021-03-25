import Watcher from "./../../../src/v4/Watcher";
import Util from "./../../../src/v4/util/package";
import Node from "./Node";

export class NodeManager extends Watcher {
    static Extractor = entity => [ entity.position.x, entity.position.y ];

    constructor(size = [ 1, 1 ], { extractor } = {}) {
        super();

        this._cache = new WeakMap();
        //FIXME
        // this._nodes = Agency.Util.CrossMap.CreateGrid([ ...size ], { seedFn: (x, y) => new Node(x, y, {}) });
        this._nodes = Util.CrossMap.CreateGrid([ ...size ], {
            seedFn: (x, y) => {
                const node = new Node(x, y, {});

                node.$.subscribe((event, [ entity ]) => {
                    if(event === "join") {
                        this.cache.set(entity, { x: entity.position.x, y: entity.position.y });
                    }
                });

                return node;
            },
        });

        this.__extractor = extractor;
    }

    get extractor() {
        if(typeof this.__extractor === "function") {
            return this.__extractor;
        }
        
        return NodeManager.Extractor;
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
        const { x, y } = this.cached(entity) || {};
        const leaveNode = this.node(x, y);
        const joinNode = this.extract(entity)

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

    node(x, y) {
        //FIXME
        // return this._nodes.get(Helper.round(x, 1), Helper.round(y, 1));
        return this.nodes.get(x, y);
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