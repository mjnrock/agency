import Observer from "./Observer";
import { useState, useEffect, useContext } from "react";

export function useObserver(context, prop) {
    const observable = useContext(context);
    const [ state, setState ] = useState({});

    useEffect(() => {
        const fn = function(prop, value) {
            setState({
                ...state,
                [ prop ]: value,
            });
        };

        const ob = prop ? observable[ prop ] : observable;
        let obs = new Observer(ob);
        obs.on("next", fn);

        return () => {
            obs.off("next", fn);
            obs = null;
        }
    }, []);

    return state;
};

export default {
    useObserver,
};