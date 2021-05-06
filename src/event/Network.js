import AgencyBase from "./AgencyBase";
import $DispatchState from "./$DispatchState";
import { compose } from "./util/helper";

import Registry from "./../Registry";
import MessageBus from "./MessageBus";

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
        this.bus = new MessageBus();

        this.__dispatcher.reassign(this.bus, this);
    }

    broadcast() {}
};

export default Network;