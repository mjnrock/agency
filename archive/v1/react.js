import Observer from "./Observer";
import { useState, useEffect, useContext } from "react";

export function useObserver(context, prop) {
    const ctx = useContext(context);
    const [ state, setState ] = useState({});

    useEffect(() => {
        const fn = function(st) {
            setState({
                ...st
            });
        };

        const lctx = prop ? ctx[ prop ] : ctx;
        let obs = new Observer(lctx, fn);

        return () => {
            obs.unwatch(lctx);
            obs = null;
        }
    }, []);

    return state;
};

export default {
    useObserver,
};