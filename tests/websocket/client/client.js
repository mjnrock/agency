import Network from "../../../src/event/Network";
import Client from "../../../src/modules/websocket/Client";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

// //? Use the WebSocket Network itself to handle messages
// //  This will use << .emit >> when receiving websocket messages
// const ws = Client.QuickSetup({
//     connect: true,

//     // url: `ws://localhost:3001`,
//     protocol: `ws`,
//     host: `localhost`,
//     port: 3001,
// }, {
//     bounce: function(msg, { sendToServer }) {
//         console.log("Received Message:", msg.type, msg.data)
        
//         setTimeout(() => {
//             sendToServer(msg);
//         }, 250);
//     },
// }, { broadcastMessages: false });


//? Use a separate, connected Network to handle messages
//  This will use << .broadcast >> when receiving websocket messages
const ws = Client.QuickSetup({
    connect: true,

    // url: `ws://localhost:3001`,
    protocol: `ws`,
    host: `localhost`,
    port: 3001,
});

const mainnet = new Network({}, {
    default: {
        bounce: function(msg, { ws }) {
            console.log("Received Message:", msg.type, msg.data)

            setTimeout(() => {
                ws.sendToServer(msg);
            }, 250);
        },
    },
});
ws.addListener(mainnet, { addToDefaultGlobal: "ws" });