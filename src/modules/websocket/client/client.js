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
    [ WebSocketClient.Signal.MESSAGE ]: ([ data ]) => {},
    [ WebSocketClient.Signal.OPEN ]: ([], { client }) => { 
        client.send("test", "Hello", 1,2, 4,4,4);
    },
    [ WebSocketClient.Signal.PING ]: ([ data ]) => {},
    [ WebSocketClient.Signal.PONG ]: ([ data ]) => {},
    [ WebSocketClient.Signal.UNEXPECTED_RESPONSE ]: ([ req, res ]) => {},
    [ WebSocketClient.Signal.UPGRADE ]: ([ res ]) => {},
});

/**
 * Create the client and connect to the 
 */
const client = new WebSocketClient(network, {
    connect: true,
    // packer: function(event, ...args) {
    //     return JSON.stringify({
    //         from: this.id,
    //         payload: {
    //             type: event,
    //             data: args,
    //         },
    //         timestamp: Date.now(),
    //     });
    // },

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