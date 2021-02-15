import { validate, v4 as uuidv4 } from "uuid";
import Context from "./Context";
import Proposition from "./Proposition";

export default class Registry extends Context {
    constructor() {
        super({
            entries: new Map(),
            synonyms: new Map(),
        });

        this.attach((...args) => Registry.Register(this, ...args), Proposition.IsType("register"));
        this.attach((...args) => Registry.Unregister(this, ...args), Proposition.IsType("unregister"));
        this.attach((...args) => Registry.AddSynonym(this, ...args), Proposition.IsType("addSynonym"));
        this.attach((...args) => Registry.RemoveSynonym(this, ...args), Proposition.IsType("removeSynonym"));
    }

    // Convenience invocation methods
    register(entry, ...synonyms) {
        this.run([ "register" ], entry, ...synonyms);
    }
    unregister(...args) {
        this.run([ "unregister" ], ...args);
    }
    addSynonym(...args) {
        this.run([ "addSynonym" ], ...args);
    }
    removeSynonym(...args) {
        this.run([ "removeSynonym" ], ...args);
    }

    find(...args) {
        return Registry.Find(this._state, ...args);
    }
    get(...args) {
        return Registry.Get(this._state, ...args);
    }
    getBySynonym(...args) {
        return Registry.GetBySynonym(this._state, ...args);
    }

    static Register(registry, state, entry, ...synonyms) {
        const eid = (entry || {})._id || uuidv4();

        state.entries.set(eid, entry);

        for(let synonym of synonyms) {
            state.synonyms.set(synonym, eid);
        }

        registry.emit("addition", eid, entry, ...synonyms);

        return state;
    }
    static Unregister(state, entry) {
        let eid;
        if(validate(entry)) {
            eid = entry;
        } else {
            eid = entry.id;
        }

        state.entries.delete(eid);

        for(let [ syn, id ] of state.synonyms.entries()) {
            if(eid === id) {
                state.synonyms.delete(syn);
            }
        }

        registry.emit("removal", eid, entry);

        return state;
    }

    static AddSynonym(state, entryOrId, ...synonyms) {
        let eid;
        if(validate(entryOrId)) {
            eid = entryOrId;
        } else {
            eid = entryOrId.id;
        }

        for(let synonym of synonyms) {
            state.synonyms.add(synonym, eid);
        }

        return state;
    }
    static RemoveSynonym(state, ...synonyms) {
        for(let synonym of synonyms) {
            state.synonyms.delete(synonym);
        }

        return state;
    }

    static Find(state, ...inputs) {
        const entries = [];

        for(let input of inputs) {
            let entry = state.entries.get(input);

            if(entry !== void 0) {
                entries.push(entry);
            } else {
                const eid = state.synonyms.get(input);

                if(validate(eid)) {
                    entry = state.entries.get(eid);

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

    static Get(state, id) {
        return state.entries.get(id);
    }
    static GetBySynonym(state, synonym) {
        const eid = state.synonyms.get(synonym);

        if(validate(eid)) {
            return Registry.Get(state, eid);
        }
    }
}