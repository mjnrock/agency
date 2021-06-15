import Entry from "./Entry";

export class Section extends Entry {
	static Type = "section";

	constructor(data, { children = [], type, ...opts } = {}) {
		super(type || Section.Type, data, opts);

		this.setChildren(children);
	}

	setChildren(children) {
		this.children = new Set();

		for(let child of children) {
			if(child instanceof Entry) {
				this.children.add(child);
			}
		}

		return this;
	}
	
	static Conforms(obj) {
		return "type" in obj
			&& obj.type === Section.Type
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
					meta: obj.meta,
					children: children,
				},
			);
		}

		return false;
	}
};

export default Section;