import { useState, useEffect, useContext } from "react";

export function useObserver(context, ) {
    const ctx = useContext(context);
    const [ state, setState ] = useState({});

    useEffect(() => {
        const fn = function(st) {
            setState({
                ...st
            });
        };

        let obs = new Agency.Observer(ctx, fn);

        return () => {
            obs.unwatch(ctx);
            obs = null;
        }
    }, []);

    return state;
};

export default {
    useObserver,
};