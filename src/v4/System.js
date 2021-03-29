import Emitter from "./Emitter";
import Watcher from "./Watcher";

export class System extends Watcher {
    static Events = [
        "join",
        "leave",
    ];

    constructor(entities = [], { events = [], handlers = [], ...opts } = {}) {
        super(handlers, { events: [
            ...System.Events,
            ...events,
        ], ...opts });

        this._entities = new Set();
        for(let entity of entities) {       // Don't emit on seeded entities
            if(entity instanceof Emitter) {
                this.entities.add(entity);    
                entity.$.subscribe(this);
            }
        }
    }

    get entities() {
        return this._entities;
    }
    get values() {
        return [ ...this._entities ];
    }
    get size() {
        return this._entities.size;
    }

    join(...entities) {
        for(let entity of entities) {
            if(entity instanceof Emitter) {
                this.entities.add(entity);
    
                entity.$.subscribe(this);

                Reflect.defineProperty(entity, "system", {
                    configurable: true,
                    get: function() {
                        return Reflect.get(this, "__system");
                    },
                    set: function(system) {
                        return Reflect.set(this, "__system", system);
                    },
                });
                entity.system = this;
    
                this.$join(entity);
            }
        }

        return this;
    }
    leave(...entities) {
        let bools = [];
        for(let entity of entities) {
            if(entity instanceof Emitter) {
                let bool = this.entities.delete(entity);
    
                if(bool) {    
                    entity.$.unsubscribe(this);

                    Reflect.deleteProperty(entity, "system");       // Delete the trap
                    Reflect.deleteProperty(entity, "__system");     // Delete the value

                    this.$leave(entity);
                }
    
                bools.push(bool);
            }
        }

        if(bools.length === 1) {
            return bools[ 0 ];
        }

        return bools;
    }

    fire(event, ...args) {
        for(let entity of this.entities) {
            entity.$.emit(event, ...args);
        }
    }
};

export default System;