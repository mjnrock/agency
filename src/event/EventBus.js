import Registry from "../Registry";
import Context from "./Context";
import Router from "./Router";

export class EventBus extends Registry {
    static Instance = new EventBus();

    static Middleware = emitter => emitter.addSubscriber(EventBus.Route);

    constructor() {
        super();

        this.router = new Router();
    }

    matchFirst() {
        this.router.type = Router.EnumRouteType.MatchFirst;

        return this;
    }
    matchAll() {
        this.router.type = Router.EnumRouteType.MatchAll;

        return this;
    }

    joinContext(nameOrContext, emitter, ...synonyms) {
        const context = this[ nameOrContext ];

        if(context instanceof Context) {            
            return context.join(emitter, ...synonyms);
        }
    }
    leaveContext(nameOrContext, emitterSynOrId) {
        const context = this[ nameOrContext ];

        if(context instanceof Context) {            
            return context.leave(emitterSynOrId, ...synonyms);
        }
    }

    createContext(name, ...args) {
        const context = new Context(...args);

        this.register(context, name);

        return context;
    }
    createContexts(createContextArgs = []) {
        let contexts = [];
        for(let [ name, ...args ] of createContextArgs) {
            contexts.push(this.createContext(name, ...args));
        }

        return contexts;
    }
    
    destroyContext(nameOrContext) {
        return this.unregister(nameOrContext);
    }
    destroyContexts(destroyContextArgs = []) {
        let results = [];
        for(let [ name, ...args ] of destroyContextArgs) {
            results.push(this.destroyContext(name, ...args));
        }

        return results;
    }

    process(contexts = []) {
        if(contexts.length === 0) {
            for(let context of this) {
                context.process();
            }

            return this;
        }

        for(let nameOrContext of contexts) {
            const context = this[ nameOrContext ];

            if(context instanceof Context) {
                context.process();
            }
        }

        return this;
    }

    static get $() {
        if(!EventBus.Instance) {
            EventBus.Instance = new EventBus();
        }

        return EventBus.Instance;
    }
    static Reassign(...args) {
        EventBus.Instance = new EventBus(...args);
    }

    static Route(...args) {
        EventBus.$.router.route(this, ...args);     // @this should resolve to the payload here, based on <Emitter> behavior
    }
};

export default EventBus;