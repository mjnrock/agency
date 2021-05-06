import express from "express";
import expressWs from "express-ws";

import { QuickSetup as SetupWSServer} from "./../../../src/modules/websocket/Server";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const app = express();
const port = 3001;
const wss = SetupWSServer(expressWs(app), {
    test: function(data) {
        console.log("Test")
        // console.log(this)
        console.log(...data)
    },
    bounce: function(data, { server }) {
        setTimeout(() => {
            server.sendToAll("bounce", ...data);
        }, 1000);
    },
});

/**
 * This is a newer way to do the work commonly seen with `bodyParser`
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

/**
 * This activates CORS
 */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //? Whatever middleware work .next() is doing is ESSENTIAL to actually making this work
    return next();
});
    
/**
 * A basic middleware example
 */
app.use(function (req, res, next) {
    console.log("middleware");
    req.testing = "testing";

    return next();
});

/**
 * A basic routing example
 */
app.get("/", function(req, res, next){
    console.log("get route", req.testing);
    res.end();
});

/**
 * Start the server
 */
app.listen(port, () =>
    console.log(`WebSocket server is listening on port ${ port }!`),
);


// setInterval(() => {
//     wss.sendToAll("test", 1, 2, 3, 4, 5);
// }, 2500);




//NOTE: Below is some SSL nonsense for when it comes to that
/**
 * Express/Windows/SSL
 * https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node
 * 
 * iOS Trust Store
 * https://apple.stackexchange.com/questions/123988/how-to-add-a-crt-certificate-to-iphones-keychain
 */




// /**
//  * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
//  *  as a single-route (firstMatch), single-channel (named "default") network
//  *  with real-time processing.
//  */
// const network = new BasicNetwork({
//     /**
//      * WebSocketClient handlers
//      */
//     [ WebSocketServer.Signal.LISTENING ]: () => {},
//     [ WebSocketServer.Signal.CLOSE ]: () => {},
//     [ WebSocketServer.Signal.CONNECTION ]: ([ client ]) => {},
//     [ WebSocketServer.Signal.HEADERS ]: ([ headers, req ]) => {},
//     [ WebSocketServer.Signal.Client.MESSAGE ]: ([ { type, data }, client, req ]) => {
//         if(!Array.isArray(data)) {
//             data = [ data ];
//         }

//         network.emit(client, type, ...data);
//     },
//     [ WebSocketServer.Signal.Client.DISCONNECT ]: ([ code, reason ]) => console.log(`Client left with code ${ code }`),
    
//     /**
//      * Unpacked WebSocketClient.Signal.MESSAGE handlers
//      */
//     test: function(data) {
//         console.log("Test")
//         // console.log(this)
//         console.log(...data)
//     },
// });
// const wss = new WebSocketServer(expressWs(app), network);