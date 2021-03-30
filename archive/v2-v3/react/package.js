import { useState, useEffect, useContext } from "react";

import AgencyObserver from "./../Observer";
import AgencyObservable from "./../Observable";

import JSXComponents from "./components/package";

export const Components = JSXComponents;

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
        if(observable instanceof AgencyObservable) {
            obs = new AgencyObserver(observable);
        } else {
            obs = AgencyObserver.SubjectFactory(observable);
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

export function useBeacon(context, prop) {
    const ctx = useContext(context);
    const [ beacon, setBeacon ] = useState(prop ? ctx[ prop ] : ctx);
    const [ data, setData ] = useState({});

    useEffect(() => {
        const fn = function(prop, value) {
            if(beacon) {
                setData({
                    ...data,
                    [ prop ]: value,
                });
            }
        };
        beacon.on("next", fn);

        return () => {
            beacon.off("next", fn);
            setBeacon(null);
        }
    }, []);

    return { data, beacon };
};

export default {
    Components: JSXComponents,

    useObserver,
    useBeacon,
};








//! React Example Usage
//==========================================================
// export const ctx = new Agency.Observable.Factory({
//     cats: 2,
// });
// // export const ctx = new Agency.Context.Factory({
// //     cats: 2,
// // });
// // export const ctx = new Agency.Store.Factory({
// //     cats: 2,
// // }, (state, prop, value) => {
// //     return {
// //         ...state,
// //         [ prop ]: Number.isNaN(state[ prop ]) ? 0 : state[ prop ] + 1,
// //     }
// // });
// export const Context = React.createContext(ctx);

// function App() {
//     return (
//         <Router>
//             <ScrollToTop>
//                 <Context.Provider value={{
//                     game: ctx,
//                 }}>
//                     <Switch>                            
//                         <Route path="/">
//                             <Routes.Home />
//                         </Route>
//                     </Switch>
//                 </Context.Provider>
//             </ScrollToTop>
//         </Router>
//     )
// }

// export default App;

// /* eslint-disable */
// import React from "react";
// import { Segment } from "semantic-ui-react";

// import { Context } from "./../../App";
// import { useObserver } from "@lespantsfancy/agency/lib/react";

// export default function GameView() {
//     const [ data, game ] = useObserver(Context, "game");
    
//     if(Object.keys(game || {}).length === 0) {
//         return null;
//     }

//     return (
//         <Segment textAlign="center">
//             <div>Cats: { data.cats }</div>
//             <div>Dogs: { data.dogs }</div>

//             <button
//                 onClick={ e => {
//                     game.cats += 1;
//                     // game.dispatch("cats", 1);
//                 } }
//             >Click</button>
//         </Segment>
//     )
// }