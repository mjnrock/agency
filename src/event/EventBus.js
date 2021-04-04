import Registry from "../Registry";
import Channel from "./Channel";
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

    joinChannel(nameOrChannel, emitter, ...synonyms) {
        const channel = this[ nameOrChannel ];

        if(channel instanceof Channel) {            
            return channel.join(emitter, ...synonyms);
        }
    }
    leaveChannel(nameOrChannel, emitterSynOrId) {
        const channel = this[ nameOrChannel ];

        if(channel instanceof Channel) {            
            return channel.leave(emitterSynOrId, ...synonyms);
        }
    }

    createChannel(name, ...args) {
        const channel = new Channel(...args);

        this.register(channel, name);

        return channel;
    }
    createChannels(createChannelArgs = []) {
        let channels = [];
        for(let [ name, ...args ] of createChannelArgs) {
            channels.push(this.createChannel(name, ...args));
        }

        return channels;
    }
    
    destroyChannel(nameOrChannel) {
        return this.unregister(nameOrChannel);
    }
    destroyChannels(destroyChannelArgs = []) {
        let results = [];
        for(let [ name, ...args ] of destroyChannelArgs) {
            results.push(this.destroyChannel(name, ...args));
        }

        return results;
    }

    process() {
        for(let channel of this) {
            channel.process();
        }
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