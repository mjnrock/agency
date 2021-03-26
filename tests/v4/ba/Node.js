// import Emitter from "./util/agency/Emitter";
import Emitter from "../../../src/v4/Emitter";

export class Node extends Emitter {
    constructor(coords = [], terrain, { portals = [], occupants = [], frequency = 0, value = 0, clearance = Infinity } = {}) {
        super([
            "join",
            "leave",
            "portal",
        ]);
        // super({
        //     join: Emitter.Handler,
        //     leave: Emitter.Handler,
        //     portal: Emitter.Handler,
        // });

        this._coords = coords;
        this._terrain = terrain;
        
        this._portals = new Set(portals);
        this._occupants = new Set(occupants);

        this._frequency = frequency;
        this._value = value;
        this._clearance = clearance;
    }

    get coords() {
        this._coords;
    }
    get x() {
        return this._coords[ 0 ];
    }
    get y() {
        return this._coords [ 1 ];
    }
    get z() {
        return this._coords [ 2 ];
    }
    get w() {
        return this._coords [ 3 ];
    }
    
    get terrain() {
        return this._terrain;
    }

    get cost() {
        return this._terrain.terrain.cost;
        // return this._terrain.terrain.cost + (this._occupants.size ? Infinity : 0);
    }
    get pathInfo() {
        return {
            x: this.x,
            y: this.y,
            cost: this.cost,
        };
    }
    
    pos(asObject = true) {
        if(asObject) {
            return {
                x: this.x,
                y: this.y,
            };
        }

        return [ this.x, this.y ];
    }

    join(entity) {
        const size = this._occupants.size;
        
        this._occupants.add(entity);

        if(this._occupants.size >= size) {
            ++this._frequency;

            this.$join(entity);
        }

        return this;
    }
    leave(entity) {
        if(this._occupants.delete(entity)) {
            this.$leave(entity);
        }

        return this;
    }
};

export default Node;