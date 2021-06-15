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
};

export default Section;