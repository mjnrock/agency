import AgencyBase from "../AgencyBase";
import Context from "./Context";
import EventBus from "./EventBus";

export class Router extends AgencyBase {
    static EnumRouteType = {
        MatchFirst: 1,
        MatchAll: 2,
    };
    
    constructor(routes = [], { type = Router.EnumRouteType.MatchFirst } = {}) {
        super();

        this.type = type;

        this.routes = new Set();
        this.createRoutes(...routes);
    }

    route(payload, ...args) {
        let hasResult = false;

        for(let fn of this.routes) {
            let results = fn(payload, ...args);

            if(!Array.isArray(results)) {
                results = [ results ];
            }

            for(let result of results) {
                const context = EventBus.$[ result ];

                if(context instanceof Context) {
                    context.bus(payload, args);

                    hasResult = true;
                }
            }            
                    
            if(hasResult && this.type === Router.EnumRouteType.MatchFirst) {
                return this;
            }
        }

        return this;
    }

    createRoute(filterFn) {
        if(typeof filterFn === "function") {
            this.routes.add(filterFn);
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
            return this.routes.delete(filterFn);
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

export default Router;