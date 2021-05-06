/* eslint-disable */
import { useState, useEffect } from "react";

import Dispatcher from "./../event/Dispatcher";
import Context from "./../event/Context";

export function useEventContext(context) {
    const [ state, setState ] = useState(() => context.getState());
    const [ dispatcher ] = useState(() => new Dispatcher(context.network, context.network));

    useEffect(() => {
        const handler = function([ state ]) {
            setState(state);
        };
        
        context.addHandler(Context.Signals.UPDATE, handler);
        
        return () => {
            context.removeHandler(Context.Signals.UPDATE, handler);
        };
    }, []);
    
    return [ state, dispatcher.dispatch, dispatcher.broadcast ];
};

export default {
    useEventContext,
};