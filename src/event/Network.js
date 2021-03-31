import Emitter from "./Emitter";

export class Network extends Emitter {
    constructor(handlers, opts = {}) {
        super(handlers, opts);
    }
};

export default Emitter;