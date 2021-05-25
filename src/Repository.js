import { v4 as uuidv4, validate } from "uuid";

import AgencyBase from "./AgencyBase";

export class Repository extends AgencyBase {
	constructor({
		entries = [],
		config: {
			accessor = [],
			typed,
			...configRest,
		},
	}) {
		super();

		this.__config = {
			accessor: null,		// (?) fn
			accessorArgs: [],	// (?) any[]
			typed: null,		// (?) fn
		};

		this.$config({
			accessor,
			typed,
			...configRest,
		});

		
        const proxy = new Proxy(this, {
            get(target, prop) {
				
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
};

export default Repository;