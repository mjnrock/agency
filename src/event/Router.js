import AgencyBase from "../AgencyBase";
import { $Registry } from "../Registry";

import Context from "./Context";
import { compose } from "../util/helper";

export const EnumRouteType = {
    MatchFirst: 1,
    MatchAll: 2,
};

export const $Router = $super => class extends $super {    
    constructor({ Router = {}, ...rest } = {}) {
        super({ ...rest });

        this.__type = Router.type || EnumRouteType.MatchFirst;

        this.__routes = new Set();
        this.createRoutes(...(Router.routes || []));
    }

    route(payload, ...args) {
        let hasResult = false;

        for(let fn of this.__routes) {
            let results = fn(payload, ...args);

            if(!Array.isArray(results)) {
                results = [ results ];
            }

            for(let result of results) {
                const context = this[ result ];

                if(context instanceof Context) {
                    context.bus(payload, args);

                    hasResult = true;
                }
            }            
                    
            if(hasResult && this.__type === EnumRouteType.MatchFirst) {
                return this;
            }
        }

        return this;
    }

    createRoute(filterFn) {
        if(typeof filterFn === "function") {
            this.__routes.add(filterFn);
        }

        return this;
    }
    createRoutes(filterFns = []) {
        for(let fn of filterFns) {
            this.createRoute(fn);
        }

        return this;
    }

    destroyRoute(filterFn) {
        if(typeof filterFn === "function") {
            return this.__routes.delete(filterFn);
        }

        return false;
    }
    destroyRoutes(...filterFns) {
        let results = [];
        for(let fn of filterFns) {
            results.push(this.destroyRoute(fn));
        }

        return results;
    }
};

export class Router extends compose($Registry, $Router)(AgencyBase) {
    constructor() {
        super({
            Router: {
                routes: [],
                type: EnumRouteType.MatchFirst
            },
        });
        
        this.config = {
            isBatchProcess: true,
        };
    }

    /**
     * Stop routing after the first successful route
     */
    matchFirst() {
        this.type = EnumRouteType.MatchFirst;

        return this;
    }
    /**
     * Run all routes that match the event
     */
    matchAll() {
        this.type = EnumRouteType.MatchAll;

        return this;
    }

    /**
     * Turn off the batching process and process any event
     *  that comes through as it comes through for *all*
     *  <Context(s)>, including future additions.
     */
    useRealTimeProcess() {
        this.config.isBatchProcess = false;

        for(let context of this) {
            if(context instanceof Context) {
                context.useRealTimeProcess();
            }
        }

        return this;
    }
    /**
     * Turn on the batching process for *all* <Context(s)>--
     *  including future additions--and queue *all* events
     *  that get captured. They will be stored in the queue
     *  until << .process() >> is invoked.
     */
    useBatchProcess() {
        this.config.isBatchProcess = true;

        for(let context of this) {
            if(context instanceof Context) {
                context.useBatchProcess();
            }
        }

        return this;
    }


    /**
     * Create a <Context> to which events can be routed
     *  and handled in an isolated scope.
     */
    createContext(name, ...args) {
        const context = new Context(...args);

        this.register(context, name);

        if(this.config.isBatchProcess) {
            context.useBatchProcess();
        } else {
            context.useRealTimeProcess();
        }

        return context;
    }
    /**
     * A convenience method to iteratively invoke << createContext >>
     */
    createContexts(createContextArgs = []) {
        let contexts = [];
        for(let [ name, ...args ] of createContextArgs) {
            contexts.push(this.createContext(name, ...args));
        }

        return contexts;
    }
    /**
     * Remove a <Context> event route
     */
    destroyContext(nameOrContext) {
        return this.unregister(nameOrContext);
    }
    /**
     * A convenience method to iteratively invoke << destroyContext >>
     */
    destroyContexts(destroyContextArgs = []) {
        let results = [];
        for(let [ name, ...args ] of destroyContextArgs) {
            results.push(this.destroyContext(name, ...args));
        }

        return results;
    }

    /**
     * Invoke the << .process >> command on all <Context(s)>
     *  to create a linear execution chain.
     */
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
};

export default Router;