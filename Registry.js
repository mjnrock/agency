import { validate, v4 as uuidv4 } from "uuid";
import Node from "./Node";

/**
 * <Registry> intentionally allows duplicates, but there are helper functions for filtering.
 */
export default class Registry {
    constructor(...entries) {
        this._id = uuidv4();
        
        if(entries instanceof Map) {
            this._entries = entries;
        } else {
            this._entries = new Map();
            this.add(...entries);
        }

        this._synonyms = new Map();     // Really just here as a convenience if a human is maintaing the <Node/s>
    }

    add(...entries) {
        let eids = [];

        for(let entry of entries) {
            let eid = uuidv4();
            this._entries.set(eid, entry);
            eids.push(eid);
        }

        if(eids.length === 0) {
            return false;
        } else if(eids.length === 1) {
            return eids[ 0 ];
        }

        return eids;
    }
    /**
     * Will ALWAYS ADD the entry *as* a new entry
     * @param {*} entry 
     * @param  {...any} synonyms 
     */
    alias(entry, ...synonyms) {
        const eid = this.add(entry);
        this.addSynonym(eid, ...synonyms);

        return eid;
    }

    remove(entryOrId) {
        if(validate(entryOrId)) {
            this._entries.delete(entryOrId);

            for(let [ synonym, id ] of this._synonyms.entries()) {
                if(id === entryOrId) {
                    this._synonyms.delete(synonym);
                }
            }

            return true;
        } else {
            for(let [ id, entry ] of this._entries.entries()) {
                if(entry === entryOrId) {
                    this._entries.delete(id);

                    for(let [ synonym, eid ] of this._synonyms.entries()) {
                        if(eid === id) {
                            this._synonyms.delete(synonym);
                        }
                    }

                    return true;
                }
            }
        }

        return false;
    }

    get(...idsOrSynonyms) {
        let result = {};

        for(let idsyn of idsOrSynonyms) {
            if(validate(idsyn)) {
                result[ idsyn ] = this._entries.get(idsyn);
            } else {
                let id = this._synonyms.get(idsyn);

                result[ idsyn ] = this._entries.get(id);
            }
        }

        return result;
    }
    lookup(entry, asArray = false) {
        let keys = [];
        for(let [ id, e ] of this._entries.entries()) {
            if(e === entry) {
                keys.push(id);

                for(let [ syn, eid ] of this._synonyms.entries()) {
                    if(eid === id) {
                        keys.push(syn);
                    }
                }
            }
        }

        if(asArray === true) {
            return keys;
        }

        return {
            id: keys[ 0 ],
            synonyms: keys.slice(1),
        };
    }

    addSynonym(id, ...synonyms) {
        for(let synonym of synonyms) {
            this._synonyms.set(synonym, id);
        }

        return this;
    }
    removeSynonym(...synonyms) {
        for(let synonym of synonyms) {
            this._synonyms.delete(synonym);
        }

        return this;
    }

    toUnique() {
        return new Set(this._entries.values());
    }
};