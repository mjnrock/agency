import Observable from "./../../src/v2/Observable";
import Registry from "./../../src/v2/Registry";
import Context from "./../../src/v2/Context";

export class World extends Observable {
    constructor() {
        super();

        this.entities = new Registry();
        this.terrain = new Context({
            rules: {
                "*": (nv, v, { prop, target }) => {
                    return true;
                    // return nv instanceof Terrain;
                }
            }
        });
    }

    join(entity) {
        this.entities.register(entity);
    }
    leave(entity) {
        this.entities.unregister(entity);
    }
}

export default World;