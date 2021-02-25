
import { useState, useEffect, useContext } from "react";

import Observer from "./Observer";
import Observable from "./Observable";

export function useObserver(context, prop) {
    const ctx = useContext(context);
    const [ observable, setObservable ] = useState(prop ? ctx[ prop ] : ctx);
    const [ data, setData ] = useState({});

    useEffect(() => {
        const fn = function(prop, value) {
            if(observable) {
                setData({
                    ...observable.toData(),
                    [ prop ]: value,
                });
            }
        };

        let obs;
        if(observable instanceof Observable) {
            obs = new Observer(observable);
        } else {
            obs = Observer.Generate(observable);
        }
        obs.on("next", fn);

        return () => {
            obs.off("next", fn);
            obs = null;
        }
    }, []);
    useEffect(() => {
        setData(observable.toData());
    }, [ observable ]);

    return [ data, observable ];
};

export default {
    useObserver,
};