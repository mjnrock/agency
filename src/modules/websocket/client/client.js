import { BasicNetwork } from "./../../../event/Network";

import WebSocketClient from "./../Client";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

/**
 * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
 *  as a single-route (firstMatch), single-context (named "default") network
 *  with real-time processing.
 */
const network = new BasicNetwork({
    [ WebSocketClient.Signal.CLOSE ]: ([ code, reason ]) => {
        console.log("Toodles");
    },
    [ WebSocketClient.Signal.ERROR ]: ([ error ]) => {},
    [ WebSocketClient.Signal.MESSAGE ]: ([{ type, data }], { client }) => {
        if(!Array.isArray(data)) {
            data = [ data ];
        }

        network.emit(client, type, ...data);
    },
    [ WebSocketClient.Signal.OPEN ]: ([], { client }) => { 
        console.log("Greetings");
    },
    [ WebSocketClient.Signal.PING ]: ([ data ]) => {},
    [ WebSocketClient.Signal.PONG ]: ([ data ]) => {},
    [ WebSocketClient.Signal.UNEXPECTED_RESPONSE ]: ([ req, res ]) => {},
    [ WebSocketClient.Signal.UPGRADE ]: ([ res ]) => {},

    test: function(data) {
        console.log("Test")
        // console.log(this)
        console.log(...data)
    }
});

/**
 * Create the client and connect to the 
 */
const client = new WebSocketClient(network, {
    connect: true,

    // url: `ws://localhost:3001`,
    protocol: `ws`,
    host: `localhost`,
    port: 3001,
});

/**
 * Load @client into the global store
 */
network.storeGlobal({
    client: client,
});