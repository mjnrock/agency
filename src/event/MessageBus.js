import Registry from "./../Registry";
import Router from "./Router";
import Channel from "./Channel";
import Message from "./Message";

export class MessageBus {
    constructor(channels = [], routes = [], { middleware } = {}) {
        this.channels = new Registry();
        this.router = new Router(this, {
            routes: routes,
        });
        
        this.config = {
            isBatchProcess: false,
            middleware,
        };

        for(let arg of channels) {
            if(arg instanceof Channel) {
                this.channels.register(arg);
            } else {
                let chnl = Array.isArray(arg) ? arg : [ arg ];
                this.createChannel(...chnl);
            }
        }
    }

    /**
     * Turn off the batching process and process any event
     *  that comes through as it comes through for *all*
     *  <Channel(s)>, including future additions.
     */
    useRealTimeProcess() {
        this.config.isBatchProcess = false;

        for(let channel of this.channels) {
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

        for(let channel of this.channels) {
            if(channel instanceof Channel) {
                channel.useBatchProcess();
            }
        }

        return this;
    }


    /**
     * Invoke the << .process >> command on all <Channel(s)>
     *  to create an ordered execution chain.
     */
    process(...channels) {
        for(let nameOrChannel of channels) {
            let channel;
            if(typeof nameOrChannel === "string" || nameOrChannel instanceof String) {
                channel = this.channels[ nameOrChannel ];
            } else {
                channel = nameOrChannel;
            }

            if(channel instanceof Channel) {
                channel.process();
            }
        }

        return this;
    }
    /**
     * Invoke the << .empty >> command on all <Channel(s)>
     */
    emptyChannels(...channels) {
        if(channels.length === 0) {
            for(let channel of this.channels) {
                channel.empty();
            }

            return this;
        }

        for(let name of channels) {
            const channel = this.channels[ name ];

            if(channel instanceof Channel) {
                channel.empty();
            }
        }

        return this;
    }


    /**
     * Create and send a <Message> directly to the invoking <Network>
     *  This will pass the message to << .receive >>
     */
    emit(emitter, event, ...args) {
        // console.log(emitter)
        if(Message.Conforms(emitter)) {
            this.receive(emitter);
        } else {
            this.receive(new Message(emitter, event, ...args));
        }

        return this;
    }
    receive(message) {
        let msg = message;
        if(typeof this.config.middleware === "function") {
            msg = this.config.middleware(message);
        }
        
        this.router.route(msg);
    }

    /**
     * Create a <Channel> to which events can be routed
     *  and handled in an isolated scope.
     */
    createChannel(name, ...args) {
        let channel;
        
        if(name instanceof Channel) {
            channel = name;
        } else {
            channel = new Channel(...args);
        }

        this.channels.register(channel, name);

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
        for(let [ name, ...args ] of createChannelArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            channels.push(this.createChannel(name, ...args));
        }

        return channels;
    }
    /**
     * Remove a <Channel> event route
     */
    destroyChannel(nameOrChannel) {
        return this.channels.unregister(nameOrChannel);
    }
    /**
     * A convenience method to iteratively invoke << destroyChannel >>
     */
    destroyChannels(destroyChannelArgs = []) {
        let results = [];
        for(let [ name, ...args ] of destroyChannelArgs.map(v => Array.isArray(v) ? v : [ v ])) {
            results.push(this.destroyChannel(name, ...args));
        }

        return results;
    }
};

export default MessageBus;