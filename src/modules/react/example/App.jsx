import React from "react";

import ReactNetwork from "./../ReactNetwork";
import { useNetwork, useContextNetwork } from "./../useNetwork"

export const Context = React.createContext();

const network = new ReactNetwork({
    cats: 54,
});

function App() {
    // const { state, dispatch } = useNetwork(network);

    return (
        <Context.Provider value={{ testProp: { n1: { n2: network } } }}>
        {/* <Context.Provider value={{ testProp: network }}> */}
            <Comp />
        </Context.Provider>
    );
};

function Comp() {
    const { state, dispatch } = useContextNetwork(Context, "testProp.n1.n2");
    // const { state, dispatch } = useContextNetwork(Context, "testProp");

    // console.log(state)

    return (
        <div>
            <div>
                {
                    JSON.stringify(state)
                }
            </div>
        </div>
    );
}

export default App;