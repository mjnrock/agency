/* eslint-disable */
import { useState, useEffect } from "react";

import Network from "./../event/Network";
import Dispatcher from "./../event/Dispatcher";
import Context from "./../event/Context";

export function useNetwork(network, contexts = [ "default" ], emitter) {    
    const [ state, setState ] = useState(() => network.getState());
    const [ dispatcher, setDispatcher ] = useState(() => new Dispatcher(network, emitter || network));
    
    useEffect(() => {
        if(emitter && dispatcher.subject !== emitter) {
            setDispatcher(new Dispatcher(network, emitter));
        }
    }, [ emitter ]);

    useEffect(() => {
        // const handler = function([ state, oldState, changes ]) {
        const handler = function([ state ]) {
            setState(state);
        };
        
        for(let context of contexts) {
            if(context instanceof Context) {
                context.addHandler(Network.Signals.UPDATE, handler);
            } else {
                const ctx = network.router[ context ];
                
                if(ctx instanceof Context) {
                    ctx.addHandler(Network.Signals.UPDATE, handler);
                }
            }
        }
        
        return () => {
            for(let context of contexts) {
                if(context instanceof Context) {
                    context.removeHandler(Network.Signals.UPDATE, handler);
                } else {
                    const ctx = network.router[ context ];
                    
                    if(ctx instanceof Context) {
                        ctx.removeHandler(Network.Signals.UPDATE, handler);
                    }
                }
            }
        };
    }, [ network, contexts ]);
    
    return [ state, dispatcher.dispatch, dispatcher.broadcast ];
};

export default {
    useNetwork,
};