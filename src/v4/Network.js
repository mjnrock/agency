import Emitter from "./Emitter";
import Watcher from "./Watcher";
import Registry from "./Registry";

export class Network extends Watcher {
    static Events = [
        "join",
        "leave",
    ];

    /**
     * @parentKey will be inserted via Reflect.defineProperty into the emitter on .join--as an internal property (i.e. `__${ parentKey }`)--and removed on .leave
     */
    constructor(emitters = [], { events = [], handlers = [], parentKey = "network", ...opts } = {}) {
        super(handlers, { events: [
            ...Network.Events,
            ...events,
        ], ...opts });

        this.__parentKey = parentKey;

        this.emitters = new Registry();
        this.join(...emitters);
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

    join(emitter, ...synonyms) {
        if(emitter instanceof Emitter) {
            this.emitters.register(emitter, ...synonyms);

            this.$.watch(emitter);

            Reflect.defineProperty(emitter, this.__parentKey, {
                configurable: true,
                get: function() {
                    return Reflect.get(this, `__${ this.__parentKey }`);
                },
                set: function(value) {
                    return Reflect.set(this, `__${ this.__parentKey }`, value);
                },
            });
            emitter[ this.__parentKey ] = this;

            this.$join(emitter);
        }

        return this;
    }
    joinMany(joinArgs = []) {
        for(let [ emitter, ...synonyms ] of joinArgs) {
            this.join(emitter, ...synonyms);
        }

        return this;
    }

    leave(...emitters) {
        let bools = [];
        for(let emitter of emitters) {
            if(emitter instanceof Emitter) {
                let bool = this.emitters.unregister(emitter).length;
    
                if(bool) {    
                    this.$.unwatch(emitter);

                    Reflect.deleteProperty(emitter, `__${ this.__parentKey }`);     // Delete the value
                    Reflect.deleteProperty(emitter, this.__parentKey);       // Delete the trap--will get recreated if emitter rejoins a <${ this.__parentKey }>

                    this.$leave(emitter);
                }
    
                bools.push(bool);
            }
        }

        if(bools.length === 1) {
            return bools[ 0 ];
        }

        return bools;
    }

    /**
     * Due to the nature of <Emitter>, if an emitter does not contain
     *      the @event, then it will not emit it.  This behavior can
     *      be exploited to create de facto groups based on the presence
     *      or absence of an event within a given emitter, and invoke
     *      those groups collectively here.
     */
    fire(event, ...args) {
        for(let emitter of this.emitters) {
            emitter.$.emit(event, ...args);
        }

        return this;
    }

    /**
     * @param {string} event | The event name
     * @param {fn} argsFn | .$event(...args) finalizes as .broadcast(event, argsFn(...args))
     * @param {fn} filter | A selector function that filters which of this.emitters will have the new event added
     */
    addEvent(event, { argsFn, filter } = {}) {
        const emitters = typeof filter === "function" ? filter(this.emitters) : this.emitters;

        for(let emitter of emitters) {
            if(typeof argsFn === "function") {
                emitter.$.addEvent(event, argsFn);
            } else {
                emitter.$.handle(event);
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
        for(let emitter of this.emitters) {
            for(let event of events) {
                emitter.$.removeEvent(event);
            }
        }

        return this;
    }
};

export default Network;