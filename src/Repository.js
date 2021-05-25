import { v4 as uuidv4, validate } from "uuid";

import AgencyBase from "./AgencyBase";
import $Dispatchable from "./event/watchable/$Dispatchable";
import RepositoryEntry from "./RepositoryEntry";
import { compose } from "./util/helper";

/**
 * <Repository> **only** accepts <Object> entries with a << .id >>
 * 	property that **must** be a UUID.
 */
export class Repository extends compose($Dispatchable)(AgencyBase) {
	constructor({ config = {} } = {}) {
		super({});

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

				if(typeof target.__config.accessor === "function") {
					return target.__config.accessor(target, prop, [ result, ...target.__config.accessorArgs ]);
				}
				
				return result;
            },
            set(target, prop, value) {

			},
			deleteProperty(target, prop) {

			},
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
	register(entry, state = {}, synonyms = [], { forceInjectId = false } = {}) {
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

		const FIXME_ORDER = Infinity;	//TODO Generate an order scalar based on current situation

		this.__entries.set(entry, new RepositoryEntry(
			entry,
			FIXME_ORDER,
			{
				state: state,
				synonyms: synonyms,
			}
		));

		return true;
	}
};

export default Repository;