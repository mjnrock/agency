import Emitter from "../event/Emitter";

export class Entry extends Emitter {
	constructor(type, data, { meta = {}, scheme, readOnly = false } = {}) {
		super();

		this.type = type;
		this.data = data;

		this.meta = {
			isReadOnly: readOnly,
			scheme,
			...meta,
		};

		this.hook({
			change: function(...args) { this.onChange(...args); }.bind(this),
			true: function(...args) { this.onTrue(...args); }.bind(this),
			false: function(...args) { this.onFalse(...args); }.bind(this),

			$globals: {
				entry: this,
			},
		});

		return new Proxy(this, {
			set(target, prop, value) {
				if(prop === "type") {
					return target;
				}

				if(prop === "data") {
					if(target.meta.isReadOnly) {
						return target;
					}
					
					const oldData = target.data;
					let shouldUpdate = true;

					if(target.meta.scheme != null) {
						shouldUpdate = false;
						let scheme = target.meta.scheme;
				
						if(typeof scheme === "function") {
							scheme = scheme(value, target);
						}

						if(typeof scheme === "boolean") {
							shouldUpdate = result;
						} else if(scheme instanceof RegExp) {
							shouldUpdate = scheme.test(value);
						} else if(typeof scheme === "object") {
							scheme = Object.values(scheme);
							
							if(Array.isArray(scheme)) {
								shouldUpdate = scheme.includes(value);
							}
						}		
					}

					if(shouldUpdate) {
						target.data = value;
				
						target.emit("change", target.data, oldData);
					}

					return target;
				}

				return Reflect.set(target, prop, value);
			}
		})
	}

	setByKey(indexOrKey) {
		let options = this.meta.options;

		if(typeof options === "function") {
			options = options(data, this);
		}

		if(typeof indexOrKey === "number") {
			if(Array.isArray(options)) {
				this.data = options[ indexOrKey ];
			} else if(typeof options === "object") {
				this.data = Object.values(options)[ indexOrKey ];
			}
		} else if(typeof indexOrKey === "string" || indexOrKey instanceof String) {
			this.data = options[ indexOrKey ];
		}

		return this;
	}

	onChange(msg, opts = {}) {}
	onTrue(msg, opts = {}) {}
	onFalse(msg, opts = {}) {}


	toObject() {
		const obj = Object.assign({}, this);

		if(obj.meta.scheme instanceof RegExp || typeof obj.meta.scheme === "function") {
			obj.meta.scheme = obj.meta.scheme.toString();
		}

		if(this.children instanceof Set) {
			obj.children = [];

			for(let child of this.children) {
				obj.children.push(child.toObject());
			}
		}

		return obj;
	}

	toJSON(replacer = null, space = null) {
		return JSON.stringify(this.toObject(), replacer, space);
	}

	static Conforms(obj) {
		return "type" in obj
			&& "data" in obj
			&& "meta" in obj;
	}
	static FromObject(obj) {
		if(this.Conforms(obj)) {
			return new Entry(
				obj.type,
				obj.data,
				{
					meta: obj.meta,
				},
			);
		}

		return false;
	}
	static FromJson(json) {
		let obj = json;

		while(typeof obj === "string" || obj instanceof String) {
			obj = JSON.parse(obj);
		}

		return this.FromObject(obj);
	}
};

export default Entry;