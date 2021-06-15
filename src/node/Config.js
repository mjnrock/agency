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
	
	static Conforms(obj) {
		return "type" in obj
			&& obj.type === Config.Type
			&& "data" in obj
			&& "meta" in obj
			&& "children" in obj;
	}
	static FromObject(obj) {
		if(this.Conforms(obj)) {
			const children = obj.children.map(child => {
				if(Section.Conforms(child)) {
					return Section.FromObject(child);
				} else if(Entry.Conforms(child)) {
					return Entry.FromObject(child);
				}
			});

			return new Section(
				obj.data,
				{
					type: obj.type,
					meta: obj.meta,
					children: children,
				},
			);
		}

		return false;
	}
};

export default Config;