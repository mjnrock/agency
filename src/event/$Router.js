import Context from "./Context";

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

export default $Router;