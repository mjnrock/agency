import Registry from "../Registry";
import Network from "./Network";

export class System extends Registry {
    static Instance = new System();
    static Middleware = emitter => System.$.join(emitter);

    constructor() {
        super();

        this.register(new Network(), "default");
    }

    static get _() {
        if(!System.Instance) {
            System.Instance = new System();
        }

        return System.Instance;
    }
    static get $() {
        return System._.default;     // sic
    }
    
    static Reassign(...args) {
        System.Instance = new System(...args);
    }
};

export default System;