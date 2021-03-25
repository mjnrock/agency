// import Emitter from "./util/agency/Emitter";
import Emitter from "../../../src/v4/Emitter";

export class Node extends Emitter {
    constructor(x, y, terrain, { portals = [], occupants = [], frequency = 0, value = 0 } = {}) {
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

        this._x = x;
        this._y = y;
        this._terrain = terrain;
        
        this._portals = new Set(portals);
        this._occupants = new Set(occupants);

        this._frequency = frequency;
        this._value = value;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
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
        this._occupants.add(entity);
        ++this._frequency;

        this.$join(entity);

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