import AgencyBase from "../AgencyBase";
import Channel from "./Channel";
import EventBus from "./EventBus";

export class Router extends AgencyBase {
    constructor(routes = []) {
        super();

        this.routes = new Set();
        this.createRoutes(...routes);
    }

    async route(payload, ...args) {
        for(let fn of this.routes) {
            let results = fn(payload, ...args);

            if(!Array.isArray(results)) {
                results = [ results ];
            }

            for(let result of results) {
                const channel = EventBus.$[ result ];

                if(channel instanceof Channel) {
                    await channel.bus(payload, args);
                }
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