import { validate, v4 as uuidv4 } from "uuid";
import Context from "./Context";
import Validator from "./Validator";

export default class Registry {
    constructor(...entries) {
        this._id = uuidv4();
        
        if(entries instanceof Map) {
            this._entries = entries;
        } else {
            this._entries = new Map();
            this.add(...entries);
        }

        this._synonyms = new Map();     // Really just here as a convenience if a human is maintaing the <Validator/s>
    }

    get entries() {
        return this._entries.entries();
    }
    get keys() {
        return [
            ...this._entries.keys(),
            ...this._synonyms.keys(),
        ];
    }
    get values() {
        return [
            ...this._entries.values(),
            ...this._synonyms.values(),
        ];
    }
    get size() {
        return this._entries.size;
    }

    add(...entries) {
        let eids = [];

        for(let entry of entries) {
            let eid = uuidv4();

            if("_id" in (entry || {})) {
                eid = entry._id;
            }

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
        for(let idsyn of idsOrSynonyms) {
            if(validate(idsyn)) {
                return this._entries.get(idsyn);
            } else {
                let id = this._synonyms.get(idsyn),
                entry = this._entries.get(id);

                if(entry !== void 0) {
                    return entry;
                }
            }
        }
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

    getId(synonym) {
        return this._synonyms.get(synonym);
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


    //  BEGIN:  HELPER FUNCTIONS
    toUnique() {
        return new Set(this._entries.values());
    }    

    /**
     * This is just a convenience elevation for a runnable
     */
    run(idOrSynonym, ...args) {
        const runnable = this.get(idOrSynonym);

        if(typeof runnable.run === "function") {
            return runnable.run(...args);
        }

        return false;
    }
};