import { QuickSetup as SetupWSClient } from "./../Client";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const client = SetupWSClient({
    connect: true,

    // url: `ws://localhost:3001`,
    protocol: `ws`,
    host: `localhost`,
    port: 3001,
}, {
    test: function(data) {
        console.log("Test")
        // console.log(this)
        console.log(...data)
    },
});

// /**
//  * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
//  *  as a single-route (firstMatch), single-context (named "default") network
//  *  with real-time processing.
//  */
// const network = new BasicNetwork({
//     /**
//      * WebSocketClient handlers
//      */
//     [ WebSocketClient.Signal.CLOSE ]: ([ code, reason ]) => console.warn(`Client has disconnected [${ code }] from`, client.url),
//     [ WebSocketClient.Signal.ERROR ]: ([ error ]) => {},
//     [ WebSocketClient.Signal.MESSAGE ]: ([{ type, data }], { client }) => {
//         if(!Array.isArray(data)) {
//             data = [ data ];
//         }

//         network.emit(client, type, ...data);
//     },
//     [ WebSocketClient.Signal.OPEN ]: ([], { client }) => {
//         console.warn(`Client has connected to`, client.url)
//     },
//     [ WebSocketClient.Signal.PING ]: ([ data ]) => {},
//     [ WebSocketClient.Signal.PONG ]: ([ data ]) => {},
//     [ WebSocketClient.Signal.UNEXPECTED_RESPONSE ]: ([ req, res ]) => {},
//     [ WebSocketClient.Signal.UPGRADE ]: ([ res ]) => {},

//     /**
//      * Unpacked WebSocketClient.Signal.MESSAGE handlers
//      */
//     test: function(data) {
//         console.log("Test")
//         // console.log(this)
//         console.log(...data)
//     },
// });

// /**
//  * Create the client and connect to the 
//  */
// const client = new WebSocketClient(network, {
//     connect: true,

//     // url: `ws://localhost:3001`,
//     protocol: `ws`,
//     host: `localhost`,
//     port: 3001,
// });

// /**
//  * Load @client into the global store for use in handlers
//  */
// network.storeGlobal({
//     client: client,
// });