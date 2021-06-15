import AgencyBase from "../AgencyBase";
import { compose } from "../util/helper";
import Channel from "./Channel";
import Message from "./Message";

export const $Emitter = $super => class extends $super {
    constructor({ Emitter = {}, ...rest } = {}) {
        super({ ...rest });
		
		this.__channel = new Channel({ handlers: {
			...(Emitter.hooks || {}),
		} });
    }

	$hook(handlers = {}) {
		this.__channel.parseHandlerObject(handlers);

		return this;
	}
	$emit(type, ...args) {
		this.__channel.bus(new Message(this, type, ...args));
	}
};

export class Emitter extends compose($Emitter)(AgencyBase) {
	constructor(hooks = {}) {
		super({
			Emitter: {
				hooks,
			},
		});
	}

	get hook() {
		return this.$hook.bind(this);
	}
	get emit() {
		return this.$emit.bind(this);
	}
}

export default Emitter;