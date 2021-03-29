import Emitter from "./Emitter";
import Watcher from "./Watcher";

export class Network extends Watcher {
    static Events = [
        "join",
        "leave",
    ];

    /**
     * @parentKey will be inserted via Reflect.defineProperty into the entity on .join--as an internal property (i.e. `__${ parentKey }`)--and removed on .leave
     */
    constructor(entities = [], { events = [], handlers = [], parentKey = "network", ...opts } = {}) {
        super(handlers, { events: [
            ...Network.Events,
            ...events,
        ], ...opts });

        this.__parentKey = parentKey;

        this.entities = new Set();
        this.join(...entities);
    }

    get pkey() {
        return this.__parentKey;
    }

    get values() {
        return [ ...this.entities ];
    }
    get size() {
        return this.entities.size;
    }

    join(...entities) {
        for(let entity of entities) {
            if(entity instanceof Emitter) {
                this.entities.add(entity);
    
                entity.$.subscribe(this);

                Reflect.defineProperty(entity, this.__parentKey, {
                    configurable: true,
                    get: function() {
                        return Reflect.get(this, `__${ this.__parentKey }`);
                    },
                    set: function(value) {
                        return Reflect.set(this, `__${ this.__parentKey }`, value);
                    },
                });
                entity[ this.__parentKey ] = this;
    
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

                    Reflect.deleteProperty(entity, `__${ this.__parentKey }`);     // Delete the value
                    Reflect.deleteProperty(entity, this.__parentKey);       // Delete the trap--will get recreated if entity rejoins a <${ this.__parentKey }>

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

export default Network;