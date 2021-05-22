import AgencyBase from "../AgencyBase";
import Network from "./Network";

export class Context extends AgencyBase {
	constructor({ state = {}, modify = {}, network } = {}) {
		super();
		
		this.__network = network || new Network(state, modify);

		const proxy = new Proxy(this, {
			get(target, prop) {
				if(prop !== "__network") {
					return Reflect.get(target.__network.__state, prop);
				}

				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				if(prop !== "__network") {
					return Reflect.set(target.__network.__state, prop, value);
				}

				return Reflect.set(target, prop, value);
			},
		});

		return proxy;
	}

    [ Symbol.iterator ]() {
        var index = -1;
        var data = Object.entries(this.__state);

        return {
            next: () => ({ value: data[ ++index ], done: !(index in data) })
        };
    }
};

export default Context;