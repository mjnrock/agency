import Channel from "./Channel";
import Message from "./Message";

export const $Dispatchable = $super => class extends $super {
    constructor({ Dispatchable = {}, ...rest } = {}) {
        super({ ...rest });
		
		this.__channel = new Channel({ handlers: {
			...(Dispatchable.hooks || {}),
		} });
    }

	$hook(handlers = {}) {
		this.__channel.parseHandlerObject(handlers);

		return this;
	}
	$dispatch(type, ...args) {
		this.__channel.bus(new Message(this, type, ...args));
	}
};

export default $Dispatchable;