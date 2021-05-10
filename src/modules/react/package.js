/* eslint-disable */
import { useState, useEffect } from "react";

import Network from "../../event/Network";
import ReactNetwork from "./ReactNetwork";

export function useNetwork(network) {
    const [ state, setState ] = useState(() => network.state);
    const [ dispatcher ] = useState(() => new Dispatcher(network.network, network.network));

    useEffect(() => {
        const handler = function([ state ]) {
            setState(state);
        };
        
        network.getChannel("_internal").addHandler(Network.Signals.UPDATE, handler);
        
        return () => {
            network.getChannel("_internal").removeHandler(Network.Signals.UPDATE, handler);
        };
    }, []);
    
    return [ state, dispatcher.dispatch, dispatcher.broadcast ];
};

export default {
    useNetwork,
    
    ReactNetwork,
};