import AgencyBase from "../../AgencyBase";
import $Dispatchable from "./$Dispatchable";
import { flatten, unflatten, recurse, compose } from "../../util/helper";
import Message from "../Message";
import Network from "../Network";

export const createMessage = (emitter, ...args) => {
	return new Message(emitter, ...args);
};

export const WatchableArchetype = class extends compose($Dispatchable)(AgencyBase) {
    constructor(...args) {
        super(...args);
    }
};

export const wrapNested = (controller, prop, input) => {
    if(input instanceof WatchableArchetype) {
        return input;
    } else if(prop[ 0 ] === "_") {
        return input;
    } else if(typeof input !== "object") {
        return input;
    } else if(input == null) {
        return input;
    }

    for(let [ key, value ] of Object.entries(input)) {
        if(typeof value === "object") {
            let kprop = `${ prop }.${ key }`;
            
            input[ key ] = wrapNested(controller, kprop, value);
        }
    }

    const proxy = new Proxy(input, {
        getPrototypeOf(t) {
            return WatchableArchetype.prototype;
        },
        get(t, p) {
            if(controller.useControlMessages) {
                if((Reflect.getOwnPropertyDescriptor(t, p) || {}).enumerable) {
                    controller.dispatch(Watchable.ControlType.READ, `${ prop }.${ p }`);
                }
            }

            return Reflect.get(t, p);
        },
        set(t, p, v) {
            const current = t[ p ];

            let nprop = `${ prop }.${ p }`;

            if(t[ p ] === v) {  // Ignore if the old value === new value
                return t;
            }

            let isNewlyCreated = current === void 0;
            
            if(p[ 0 ] === "_" || (Reflect.getOwnPropertyDescriptor(t, p) || {}).set) {
                return Reflect.defineProperty(t, p, {
                    value: v,
                    configurable: true,
                    writable: true,
                    enumerable: false,
                });
            }
            
            if(typeof v === "object") {
                let ob = wrapNested(controller, nprop, v);

                Reflect.set(t, p, ob);
            } else {
                Reflect.set(t, p, v);
            }
            
            if(!(Array.isArray(input) && p in Array.prototype)) {   // Don't broadcast native <Array> keys (i.e. .push returns .length)
                if(controller.useControlMessages) {
                    if(isNewlyCreated) {
                        controller.dispatch(Watchable.ControlType.CREATE, nprop, v);
                    } else {
                        controller.dispatch(Watchable.ControlType.UPDATE, nprop, v, current);
                    }
                    
                    
                    controller.dispatch(Watchable.ControlType.UPSERT, nprop, v, current);
                } else {
                    if(isNewlyCreated) {
                        controller.dispatch(nprop, v);
                    } else {
                        controller.dispatch(nprop, v, current);
                    }
                }
            }

            return t;
        },
        deleteProperty(t, p) {
            if(p in t) {                
                const current = Reflect.get(t, p);
                const reflect = Reflect.deleteProperty(t, p);

                let nprop = `${ prop }.${ p }`;

                if(controller.useControlMessages) {
                    controller.dispatch(Watchable.ControlType.DELETE, nprop, void 0);
                } else {
                    controller.dispatch(nprop, void 0);
                }

                target.controller.dispatch(Watchable.ControlType.UPSERT, nprop, void 0, current);

                return reflect;
            }

            return false;
        },
    });

    return proxy;
};

/**
 * The <Watchable> is an <Object> that emits changes to itself
 *  to a <Network>.  Newly added values to the <Watchable> are
 *  wrapped in a watcher for nested object changes.
 * 
 * CRUD-like messaging is available with use of the @useControlMessages
 *  flag.  A property *must be enumerable* in order for a message to fire.
 *  If @useControlMessages is *false*, then the "READ" messages are *not* fired.
 */
export class Watchable extends WatchableArchetype {
    static ControlType = {
        CREATE: `Watchable:Create`,
        READ: `Watchable:Read`,
        UPDATE: `Watchable:Update`,
        DELETE: `Watchable:Delete`,
        
        UPSERT: `Watchable:Upsert`,     // This will fire under CREATE, UPDATE, and DELETE messages
    };

    /**
     * @isStateSchema bool | false | Function values will be evaluated at one (1) level of depth [ i.e. (f => g => {})(this, key, value) --> g => {} ]
     * @emitProtected bool | false | Emit updates for props like `_%` (i.e. one (1) preceding underscore)
     * @emitPrivate bool | false | Emit updates for props like `__%` (i.e. two (2) preceding underscores)
     * @useControlMessages bool | false | Use << Watchable.ControlType >> for CRUD-like messaging from the <Watchable>.  These can be used for event-listening for data syncing.
     */
    constructor(state = {}, { hooks = {}, network, isStateSchema = false, emitProtected = false, emitPrivate = false, useControlMessages = false } = {}) {
        super({
			Dispatchable: {
				hooks: {
					"**": msg => {
						if(this.__controller.network) {
							this.__controller.network.dispatch(msg);
						}
					},
					...hooks,
				},
			},
		});

        this.__controller = {
			network: null,
			dispatch: (...args) => this.__channel.bus(createMessage(this, ...args)),
            useControlMessages,
        };

		this.$attach(network);

        for(let [ key, value ] of Object.entries(state)) {
            let newValue;
            if(isStateSchema && typeof value === "function") {
                newValue = value(this, key, value);
            } else if(typeof value === "object") {
                newValue = wrapNested(this.__controller, key, value);
            } else {
                newValue = value;
            }

            Reflect.set(this, key, newValue);
        }

        const proxy = new Proxy(this, {
            get(target, prop) {
                if((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    let props = prop.split(".");

                    if(props[ 0 ] === "$") {
                        props = props.slice(1);
                    }
                    
                    let result = target;
                    let i = 0;
                    for(let p of props) {
                        if(typeof result === "object") {
                            if(target.__controller.useControlMessages) {
                                if(i === 0 && (Reflect.getOwnPropertyDescriptor(target, prop) || {}).enumerable) {
                                    target.__controller.dispatch(Watchable.ControlType.READ, p);
                                }
                            }
                            let next = Reflect.get(result, p);
    
                            if(next !== void 0) {
                                result = next;
                            }
                        } else {
                            return void 0;  // Selection does not exist
                        }

                        ++i;
                    }

                    if(result !== target) {
                        return result;
                    } else {
                        return;
                    }
                }

                if(target.__controller.useControlMessages) {
                    if((Reflect.getOwnPropertyDescriptor(target, prop) || {}).enumerable) {
                        target.__controller.dispatch(Watchable.ControlType.READ, prop);
                    }
                }

                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
                const current = target[ prop ];

				if(prop === "$set" && typeof value === "object") {
					for(let k of Object.keys(target)) {
						delete target[ k ];
					}
					for(let [ k, v ] of Object.entries(value)) {
						target[ k ] = v;
					}

					return target;
				}

                if(current === value) {
                    return target;
                } else if(prop[ 0 ] === "_") {
                    if(emitProtected !== true) {
                        return Reflect.set(target, prop, value);
                    } else if(prop[ 1 ] === "_") {
                        if(emitPrivate !== true) {
                            return Reflect.set(target, prop, value);
                        }
                    }
                }

                let newValue;
                if(typeof value === "object") {
                    newValue = wrapNested(target.__controller, prop, value);
                } else {
                    newValue = value;
                }

                let isNewlyCreated = current === void 0;
                let reflect = Reflect.set(target, prop, newValue);

                if(target.__controller.useControlMessages) {
                    if(isNewlyCreated) {
                        target.__controller.dispatch(Watchable.ControlType.CREATE, prop, newValue);
                    } else {
                        target.__controller.dispatch(Watchable.ControlType.UPDATE, prop, newValue, current);
                    }
                    
                    target.__controller.dispatch(Watchable.ControlType.UPSERT, prop, newValue, current);
                } else {
                    if(isNewlyCreated) {
                        target.__controller.dispatch(prop, newValue);
                    } else {
                        target.__controller.dispatch(prop, newValue, current);
                    }
                }

                return reflect;
            },
            deleteProperty(target, prop) {
                const current = Reflect.get(target, prop);
                const reflect = Reflect.deleteProperty(target, prop);

                if(target.__controller.useControlMessages) {
                    target.__controller.dispatch(Watchable.ControlType.DELETE, prop, void 0);
                } else {
                    target.__controller.dispatch(prop, void 0);
                }

                target.__controller.dispatch(Watchable.ControlType.UPSERT, prop, void 0, current);

                return reflect;
            },
        });

        return proxy;
    }
	
	get isAttached() {
		return !!this.__controller.network;
	}
	$attach(network) {
		if(network instanceof Network) {
			this.$detach();

			this.__controller.network = network.addListener(this);
		}

		return this;
	}
	$detach() {
		if(this.__controller.network) {
			this.__controller.network.leave();
			this.__controller.network = null;
		}

		return this;
	}

    /**
     * Arguments are passed directly to << .toString >>
     * Final buffer has the following concatenation:
     * [ primaryLength ][ primaryChar(s) ][ secondaryLength ][ secondaryChar(s) ][ << this.toString(...args) >> ]
     * 
     * E.g. primary="|",secondary=":",this={ test: true } --> `1|1:test:true`
     * E.g. both=".",this={ test: true, another: "yes" } --> `1.1.test.true.another.yes`
     */
    toBuffer({ primary = "|", secondary = ":", all } = {}) {
        const str = this.toString({ primary, secondary, all });
        const buffer = Buffer.from(`${ primary.length }${ primary }${ secondary.length }${ secondary }${ str }`);

        return buffer;
    }
    toString({ primary = "|", secondary = ":", all } = {}) {
        if(all) {
            primary = secondary = all.toString();
        }

        return flatten(this, { asArray: true }).map(([ k, v ]) => `${ k }${ secondary }${ v }`).join(primary);
    }
    toObject(includeCustomFns = true) {
		if(includeCustomFns) {
			return Object.assign({}, this);
		}
		
		const obj = Object.assign({}, this);
		for(let key of Object.keys(obj)) {
			if(typeof obj[ key ] === "function") {
				delete obj[ key ];
			}
		}

		return obj;
    }
    toSchemaObject() {
        const obj = this.toObject(true);

        return recurse(obj, {
            setter: (key, value) => ({
                type: typeof value,
                value: value,
            }),
        });
    }
    toJson(includeCustomFns = true) {
        return JSON.stringify(this.toObject(includeCustomFns), (key, value) => {
			if(typeof value === "function") {
				return value.toString();
			} else if(value === this) {
				return WatchableArchetype;
			}
			
			return value;
		});
    }

    static Flatten(watchable, opts = {}) {
        return flatten(watchable, opts);
    }
    static Unflatten(obj, opts = {}, unflattenOpts = {}) {
        return new this(unflatten(obj, unflattenOpts), opts);
    }

	static Generate(watchable, opts = {}) {
		if(watchable instanceof this) {
			return new this(watchable.toObject(opts.includeCustomFns), opts);
		} else if(!Array.isArray(watchable) && typeof watchable === "object") {
			return new this(watchable, opts);
		}

		return false;
	}

	/**
	 * @qty may be a number or a fn(args)
	 * @args may be direct arguments or a fn(i) to determine appropriate arguments for that iteration
	 * Returns one (1) <Watchable> if @qty === 1 and [ ...<Watchable> ] if @qty > 1
	 * 
	 * @metaFactory can be set to << true|"async" >> to instead receive a "default args" version of << Factory|AsyncFactory >>
	 *  that will use all passed arguments as the defaults.  The async version of this
	 *  can also return a factory, but it is also exposed here so that the meta factory method is not a <Promise>.
	 */
	static Factory(args = [], qty = 1, metaFactory = false) {
		if(typeof qty === "function") {
			qty = qty(args);
		}

		const results = [];
		for(let i = 0; i < qty; i++) {
			let localArgs;
			if(typeof args === "function") {
				localArgs = args(i);
			} else {
				if(Array.isArray(args)) {
					localArgs = args;
				} else {
					localArgs = [ args ];
				}
			}

			const watch = new this(...localArgs);

			results.push(watch);
		}
		
		if(metaFactory === true || metaFactory === "sync") {
			return (localArgs, localQty) => {
				localArgs = localArgs == null ? args : localArgs;
				localQty = localQty == null ? qty : localQty;
		
				return Factory(localArgs, localQty, false);
			};
		} else if(metaFactory === "async") {
			return async (localArgs, localQty) => {
				localArgs = localArgs == null ? args : localArgs;
				localQty = localQty == null ? qty : localQty;
		
				return await AsyncFactory(localArgs, localQty, false);
			};
		}


		if(results.length > 1) {
			return results;
		}

		return results[ 0 ];
	};

	/**
	 * Identical to << Factory >>, except that functions can be
	 *  async functions.  This returns a resolved <Promise> with
	 *  the final <Watchable> value(s).
	 * 
	 * @metaFactory can be set to << true >> to instead receive a "default args" version of << Factory >>
	 *  that will use all passed arguments as the defaults.
	 */
	static async AsyncFactory(args = [], qty = 1, metaFactory = false) {
		if(typeof qty === "function") {
			qty = await qty(args);
		}

		const results = [];
		for(let i = 0; i < qty; i++) {
			let localArgs;
			if(typeof args === "function") {
				localArgs = await args(i);
			} else {
				if(Array.isArray(args)) {
					localArgs = args;
				} else {
					localArgs = [ args ];
				}
			}

			const watch = new this(...localArgs);

			results.push(watch);
		}

		if(metaFactory) {
			return async (localArgs, localQty) => {
				localArgs = localArgs == null ? args : localArgs;
				localQty = localQty == null ? qty : localQty;
		
				return await AsyncFactory(localArgs, localQty, false);
			};
		}

		if(results.length > 1) {
			return Promise.resolve(results);
		}

		return Promise.resolve(results[ 0 ]);
	};
};

export default Watchable;