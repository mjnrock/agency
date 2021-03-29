import Emitter from "./Emitter";
import Watcher from "./Watcher";
import Registry from "./Registry";

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

        this.entities = new Registry();
        this.join(...entities);
    }

    get $() {
        const _this = this;
        const _broadcast = super.$.broadcast;

        return {
            ...super.$,

            /**
             * Prepend the namespace, if it exists, and eliminate redundant wrapping in nested <Network(s)>.
             */
            async broadcast(prop, value) {
                if((typeof _this.__namespace === "string" && _this.__namespace.length) || _this.__namespace === Infinity) {
                    const regex = new RegExp(`(${ _this.__namespace }\.)+`, "i");
                    const newProp = `${ _this.__namespace }.${ prop }`.replace(regex, `${ _this.__namespace }.`);

                    return _broadcast.call(this, newProp, value);
                }

                return _broadcast.call(this, prop, value);
            },
        };
    }

    join(...entities) {
        for(let entity of entities) {
            if(entity instanceof Emitter) {
                this.entities.register(entity);
    
                entity.$.subscribe(this);
                // entity.__namespace = `${ this.__namespace }.${ entity.__namespace }`;

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
                let bool = this.entities.unregister(entity).length;
    
                if(bool) {    
                    entity.$.unsubscribe(this);
                    // entity.__namespace = entity.__namespace.replace(`${ this.__namespace }.`, "");

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

        return this;
    }

    /**
     * @param {string} event | The event name
     * @param {fn} argsFn | .$event(...args) finalizes as .broadcast(event, argsFn(...args))
     * @param {fn} filter | A selector function that filters which of this.entities will have the new event added
     */
    addEvent(event, { argsFn, filter } = {}) {
        const entities = typeof filter === "function" ? filter(this.entities) : this.entities;

        for(let entity of entities) {
            if(typeof argsFn === "function") {
                entity.$.addEvent(event, argsFn);
            } else {
                entity.$.handle(event);
            }
        }

        return this;
    }
    /**
     * @param {[ event, { argsFn, filter }]} addEventArgs | This should have one array row per intended .addEvent call
     */
    addEvents(addEventArgs = []) {
        for(let [ event, opts ] of addEventArgs) {
            this.addEvent(event, opts);
        }

        return this;
    }
    removeEvent(...events) {
        for(let entity of this.entities) {
            for(let event of events) {
                entity.$.removeEvent(event);
            }
        }

        return this;
    }
};

export default Network;