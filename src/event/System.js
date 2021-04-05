import Registry from "../Registry";
import Network from "./Network";

/**
 * <System> is to be used in cases where multiple <Network(s)>
 *      are needed.  By default, the singleton <Network> will
 *      be registered to <System> with the synonym "default".
 * 
 * In order to properly utilize a multi-network system, overwrite
 *      the << System.Middleware >> method to introduce qualifying
 *      behavior that will appropriately register each newly
 *      instantiated <Emitter> to its appropriate <Network>.
 */
export class System extends Registry {
    static Instance = new System();
    static Middleware = emitter => Network.Middleware(emitter);

    constructor() {
        super();
        
        setTimeout(() => this.register(Network.$, "default"), 0);
    }

    static get $() {
        if(!System.Instance) {
            System.Instance = new System();
        }

        return System.Instance;
    }
    
    static Reassign(...args) {
        System.Instance = new System(...args);
    }
};

export default System;