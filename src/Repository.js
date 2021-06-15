import { v4 as uuidv4, validate } from "uuid";

import AgencyBase from "./AgencyBase";
import { $Emitter } from "./event/Emitter";
import RepositoryEntry from "./RepositoryEntry";
import { compose } from "./util/helper";

/**
 * <Repository> **only** accepts <Object> entries with a << .id >>
 * 	property that **must** be a UUID.
 */
export class Repository extends compose($Emitter)(AgencyBase) {
	static Signal = {
		REGISTER: "Repository.Register",
		UNREGISTER: "Repository.Unregister",
	};

	constructor({ config = {}, hooks = {} } = {}) {
		super({
			Emitter: {
				hooks,
			},
		});

		this.__config = {
			accessor: null,		// (?) fn
			accessorArgs: [],	// (?) any[]
			typed: null,		// (?) fn
		};
		this.$config(config);

		this.__entries = new Map();
		
        const proxy = new Proxy(this, {
            get(target, prop) {
				const result = Reflect.get(target, prop);

				if(prop in target) {
					return result;
				}

				if(typeof target.__config.accessor === "function") {
					return target.__config.accessor(target, prop, [ result, ...target.__config.accessorArgs ]);
				}
				
				return result;
            },
            // set(target, prop, value) {
				
			// },
			// deleteProperty(target, prop) {

			// },
		});

		return proxy;
	}

	/**
	 * Context-dependent Getter/Setter [ #CDGS ]
	 */
	$config(setting, value) {
		if(typeof setting === "object") {
			for(let [ k, v ] of Object.entries(setting)) {
				this.$config(k, v);
			}

			return this.__config;
		}

		if(value !== void 0) {
			if(setting === "accessor") {
				//	The accessor acts as an entry "get" wrapper, allowing for the return value to be mutated (e.g. class entry, instance "get")
				//	The accessorArgs acts as a pre-defined set of arguments to *also* be included (e.g. "globals")
				if(typeof value === "function") {
					this.__config.accessor = value;
				} else if(Array.isArray(value) && typeof value[ 0 ] === "function") {
					this.__config.accessor = value;
					this.__config.accessorArgs = value.slice(1) || [];
				}
			} else if(setting === "typed") {
				//	This is used to accept/reject a potential entry (T: accept, F: reject)
				if(typeof value === "function") {
					this.__config.typed = value;
				}
			} else {
				this.__config[ setting ] = value;
			}
		}		

		return this.__config;
	}

	/**
	 * @entry **must** be an object.  By default, @entry must also have a
	 * 	<< .id >> property that is a UUID.
	 * 
	 * NOTE:	The id constraint can be overridden if << @forceInjectId = true >>,
	 * 	which will **mutate the original object** by injecting a UUID into it under
	 * 	the id prop: << @entry.id = uuidv4() >>
	 */
	register(entry, { state = {}, synonyms = [], forceInjectId = false } = {}) {
		if(typeof entry !== "object") {
			return false;
		} else {
			if(forceInjectId === true) {
				entry.id = uuidv4();
			}

			if(!validate(entry.id)) {
				return false;
			}
		}

		const uuid = entry.id;
		
		//FIXME Generate an order scalar based on current situation
		const ORDER = Infinity;

		this[ uuid ] = entry;

		this.__entries.set(uuid, new RepositoryEntry(
			entry,
			ORDER,
			{
				state: state,
				synonyms: synonyms,
			}
		));

		const eventArgs = [ uuid, ORDER, synonyms ];
		this.$emit(Repository.Signal.REGISTER, ...eventArgs);

		return true;
	}
	unregister(entrySynonymOrId) {
		let uuid;
		if(typeof entrySynonymOrId === "object") {
			uuid = entrySynonymOrId.id;
		} else if(validate(entrySynonymOrId)) {
			uuid = entrySynonymOrId;
		} else if(typeof entrySynonymOrId === "string" || entrySynonymOrId instanceof String) {
			//FIXME	Synonym lookup
		}

		const result = this.__entries.delete(uuid);

		if(result) {
			this.$emit(Repository.Signal.UNREGISTER, uuid);
		}

		return result;
	}
};

export default Repository;