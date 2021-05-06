import { v4 as uuidv4 } from "uuid";

import AgencyBase from "./AgencyBase";
import $DispatchState from "./$DispatchState";
import { compose } from "./util/helper";

import Channel from "./Channel";
import Router from "./Router";
import Message from "./Message";
import Registry from "./../Registry";

export class Network extends compose($DispatchState)(AgencyBase) {
    static Signals = {
        UPDATE: `Network.Update`,
    };

    constructor({ channels = [], routes = [], state = {}, connections = [], members = [] } = {}) {
        super({
            DispatchState: {
                event: Network.Signals.UPDATE,
                state: state,
            },
        });
        
        this.connections = new Set(connections);   // Connected <Network(s)>
        this.members = new Registry();
        this.channels = new Registry();
        this.router = new Router();

        this.__dispatcher.reassign(this, this);
    }

    emit(emitter, event, ...args) {
        if(Message.Conforms(emitter)) {
            this.receive(emitter);
        } else {
            this.receive(new Message(emitter, event, ...args));
        }

        return this;
    }
    receive(message) {
        this.router.route(message);
    }

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

    broadcast()
};

export default Network;