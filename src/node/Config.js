import Section from "./Section";

export class Config extends Section {
	static Type = "config";

	constructor(data, { children = [], ...opts } = {}) {
		super(data, {
			children,
			type: Config.Type,
			...opts,
		});
	}
};

export default Config;