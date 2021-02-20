import { validate, v4 as uuidv4 } from "uuid";
import Context from "./Context";

export default class Registry extends Context {
    constructor() {
        super({
            entries: new Map(),
            synonyms: new Map(),
        });

        return new Proxy(this, {
            get: function (target, prop, receiver) {
                if(prop in target) {
                    return target[ prop ];
                } else if (target instanceof Registry) {
                    let value = target.getBySynonym(prop);

                    if(value === void 0) {
                        value = target.get(prop);
                    }

                    if(value !== void 0) {
                        return value;
                    }
                }

                return Reflect.get(...arguments);
            },
            set(target, prop, value) {
                if (target instanceof Registry) {
                    const eid = target._state.synonyms.get(prop);

                    if(validate(eid)) {
                        target._state.entries.set(eid, value);
                    
                        target.emit("update", target._state, [ false, eid, value ]);
                    }
                }
                
                return Reflect.set(...arguments);
            },
        });
    }

    get state() {
        const state = {
            ...Object.fromEntries(Array.from(this._state.entries.entries()).map(([ id, entry ]) => {
                if(entry instanceof Context) {
                    return [ id, entry.state ];
                }
                
                return [ id, entry ];
            })),
        };

        for(let [ syn, id ] of this._state.synonyms.entries()) {
            state[ syn ] = state[ id ];
        }

        return state;
    }

    /**
     * Helper function to dive through nested <Registry>
     */
    _(nestedKey) {
        let keys = nestedKey.split(".");
        let entry = this.get(keys.shift());

        if(entry !== void 0) {
            if(entry instanceof Registry) {
                return entry._(keys);
            } else if(typeof entry === "object" && keys[ 0 ] in entry) {
                return entry._(keys);
            } else if(Array.isArray(entry)) {
                return entry._(keys)[ +keys[ 0 ] ];
            }

            return entry;
        }


        // let keys = Array.isArray(nestedKey) ? nestedKey : nestedKey.split(".");
        // let key = keys.shift();
        // const entry = this._state.entries.getBySynonym(key);

        // if(entry instanceof Registry) {
        //     return entry._(keys);
        // }

        // return entry;
    }

    register(entry, ...synonyms) {
        const eid = (entry || {})._id || uuidv4();

        this._state.entries.set(eid, entry);

        //TODO  Code a bubbling version of this
        if(entry instanceof Context) {
            entry.on("update", (...args) => this.emit("update", eid, entry, ...args));
        }

        for(let synonym of synonyms) {
            this._state.synonyms.set(synonym, eid);
        }

        this.run("addition", eid, entry, ...synonyms);

        return this._state;
    }
    unregister(entry) {
        let eid;
        if(validate(entry)) {
            eid = entry;
        } else {
            eid = entry.id;
        }

        this._state.entries.delete(eid);

        for(let [ syn, id ] of this._state.synonyms.entries()) {
            if(eid === id) {
                this._state.synonyms.delete(syn);
            }
        }

        this.run("removal", eid, entry);

        return state;
    }

    addSynonym(entryOrId, ...synonyms) {
        let eid;
        if(validate(entryOrId)) {
            eid = entryOrId;
        } else {
            eid = entryOrId.id;
        }

        for(let synonym of synonyms) {
            this._state.synonyms.add(synonym, eid);
        }

        this.run("addition:synonym", eid, entry);

        return this._state;
    }
    removeSynonym(...synonyms) {
        for(let synonym of synonyms) {
            this._state.synonyms.delete(synonym);
        }

        this.run("removal:synonym", eid, entry);

        return this._state;
    }

    find(...inputs) {
        const entries = [];

        for(let input of inputs) {
            let entry = this._state.entries.get(input);

            if(entry !== void 0) {
                entries.push(entry);
            } else {
                const eid = this._state.synonyms.get(input);

                if(validate(eid)) {
                    entry = this._state.entries.get(eid);

                    if(entry !== void 0) {
                        entries.push(entry);
                    }
                }
            }
        }

        if(entries.length === 0) {
            return;
        } else if(entries.length === 1) {
            return entries[ 0 ];
        }

        return entries;
    }

    get(idOrSyn) {
        let eid = this._state.synonyms.get(idOrSyn);
        
        if(validate(eid)) {
            return this._state.entries.get(eid);
        } else if(validate(idOrSyn)) {
            return this._state.entries.get(idOrSyn);
        }
    }
    getById(id) {
        return this._state.entries.get(id);
    }
    getBySynonym(synonym) {
        const eid = this._state.synonyms.get(synonym);

        if(validate(eid)) {
            return this.get(eid);
        }
    }
}