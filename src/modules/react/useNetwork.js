import React, { useState, useEffect, useContext } from "react";

import Network from "../../event/Network";
import Dispatcher from "../../event/Dispatcher";

/**
 * Create a React Hook that will get the state of the passed network
 *  and return it, along with a dispatcher attached to that same network,
 *  using the network as its subject.
 */
export function useNetwork(network) {
    const [ state, setState ] = useState(() => network.state);
    const [ dispatcher ] = useState(() => new Dispatcher(network, network));

    useEffect(() => {
        const handler = function({ data }) {
            const [ newState ] = data;

            setState(newState);
        };
        
        network.getChannel("_internal").addHandler(Network.Signal.UPDATE, handler);
        
        return () => {
            network.getChannel("_internal").removeHandler(Network.Signal.UPDATE, handler);
        };
    }, [ network ]);
    
    return {
        state,
        dispatch: dispatcher.dispatch,
        broadcast: dispatcher.broadcast,
    };
};

/**
 * A wrapper for << useNetwork >> for cases where the network resides within
 *  a React Context.  @prop can be used with dot notation to grab a nested value.
 */
export function useContextNetwork(context, prop = "network") {
    const ctx = useContext(context);

    let nested = prop.split("."),
        network = ctx;

    for(let p of nested) {
        network = network[ p ];
    }

    return useNetwork(network);
};

export default {
    useNetwork,
    useContextNetwork,
};