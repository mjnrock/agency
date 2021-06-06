import Channel from "./Channel";

export class Router {
    static RuleType = {
        MatchFirst: 1,
        MatchAll: 2,
    };

    constructor(bus, { type, routes = [] } = {}) {
        this.bus = bus;
        this.type = type || Router.RuleType.MatchFirst;

        this.routes = new Set();
        this.createRoutes(routes);
    }

    /**
     * Stop routing after the first successful route
     */
    matchFirst() {
        this.type = Router.RuleType.MatchFirst;

        return this;
    }
    /**
     * Run all routes that match the event
     */
    matchAll() {
        this.type = Router.RuleType.MatchAll;

        return this;
    }

    route(message) {
        let hasResult = false;
        
        for(let fn of this.routes) {
            let routes = fn(message);

            if(!Array.isArray(routes)) {
                routes = [ routes ];
            }

            for(let route of routes) {
                let channel = route;
                
                if(typeof route === "string" || route instanceof String) {
                    channel = this.bus.channels[ route ];
                }
                
                
                if(channel instanceof Channel) {
                    channel.bus(message);

                    hasResult = true;
                } else if(typeof channel === "function") {
                    channel(message);
                }
            }
                    
            if(hasResult && this.type === Router.RuleType.MatchFirst) {
                return this;
            }
        }
    }

    createRoute(filterFn) {
        if(typeof filterFn === "function") {
            this.routes.add(filterFn);
        }

        return this;
    }
    createRoutes(createRouteArgs = []) {
        for(let args of createRouteArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            this.createRoute(...args);
        }

        return this;
    }

    destroyRoute(filterFn) {
        if(typeof filterFn === "function") {
            return this.routes.delete(filterFn);
        }

        return false;
    }
    destroyRoutes(destroyRouteArgs = []) {
        let results = [];
        for(let args of destroyRouteArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            results.push(this.destroyRoute(...args));
        }

        return results;
    }
};

export default Router;