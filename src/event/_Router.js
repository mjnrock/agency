import AgencyBase from "../AgencyBase";
import { $Registry } from "../Registry";

import Channel from "./Channel";
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

    route(payload) {
        let hasResult = false;

        for(let fn of this.__routes) {
            let results = fn(payload);

            if(!Array.isArray(results)) {
                results = [ results ];
            }

            for(let result of results) {
                const channel = this[ result ];

                if(channel instanceof Channel) {
                    channel.bus(payload);

                    hasResult = true;
                } else if(typeof channel === "function") {
                    channel(payload);
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
    constructor(network, channels = [], routes = []) {
        super({
            Router: {
                routes: [],
                type: EnumRouteType.MatchFirst
            },
        });

        this.network = network;
        
        this.config = {
            isBatchProcess: true,
        };

        this.createChannels(channels);
        this.createRoutes(routes);
    }

    /**
     * Turn off the batching process and process any event
     *  that comes through as it comes through for *all*
     *  <Channel(s)>, including future additions.
     */
    useRealTimeProcess() {
        this.config.isBatchProcess = false;

        for(let channel of this) {
            if(channel instanceof Channel) {
                channel.useRealTimeProcess();
            }
        }

        return this;
    }
    /**
     * Turn on the batching process for *all* <Channel(s)>--
     *  including future additions--and queue *all* events
     *  that get captured. They will be stored in the queue
     *  until << .process() >> is invoked.
     */
    useBatchProcess() {
        this.config.isBatchProcess = true;

        for(let channel of this) {
            if(channel instanceof Channel) {
                channel.useBatchProcess();
            }
        }

        return this;
    }


    /**
     * Create a <Channel> to which events can be routed
     *  and handled in an isolated scope.
     */
    createChannel(name, ...args) {
        const channel = new Channel(this.network, ...args);

        this.register(channel, name);

        if(this.config.isBatchProcess) {
            channel.useBatchProcess();
        } else {
            channel.useRealTimeProcess();
        }

        return channel;
    }
    /**
     * A convenience method to iteratively invoke << createChannel >>
     */
    createChannels(createChannelArgs = []) {
        let channels = [];
        for(let [ name, ...args ] of createChannelArgs) {
            channels.push(this.createChannel(name, ...args));
        }

        return channels;
    }
    /**
     * Remove a <Channel> event route
     */
    destroyChannel(nameOrChannel) {
        return this.unregister(nameOrChannel);
    }
    /**
     * A convenience method to iteratively invoke << destroyChannel >>
     */
    destroyChannels(destroyChannelArgs = []) {
        let results = [];
        for(let [ name, ...args ] of destroyChannelArgs) {
            results.push(this.destroyChannel(name, ...args));
        }

        return results;
    }

    /**
     * Invoke the << .process >> command on all <Channel(s)>
     *  to create an ordered execution chain.
     */
    process(channels = []) {
        if(channels.length === 0) {
            for(let channel of this) {
                channel.process();
            }

            return this;
        }

        for(let nameOrChannel of channels) {
            const channel = this[ nameOrChannel ];

            if(channel instanceof Channel) {
                channel.process();
            }
        }

        return this;
    }
    /**
     * Invoke the << .drop >> command on all <Channel(s)>
     */
    empty(channels = []) {
        if(channels.length === 0) {
            for(let channel of this) {
                channel.empty();
            }

            return this;
        }

        for(let name of channels) {
            const channel = this[ name ];

            if(channel instanceof Channel) {
                channel.empty();
            }
        }

        return this;
    }
};

export default Router;