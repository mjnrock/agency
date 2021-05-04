import express from "express";
import expressWs from "express-ws";

import { BasicNetwork } from "./../../../event/Network";
import WebSocketServer from "./../Server";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const app = express();
const port = 3001;

/**
 * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
 *  as a single-route (firstMatch), single-context (named "default") network
 *  with real-time processing.
 */
const network = new BasicNetwork({
    [ WebSocketServer.Signal.LISTENING ]: () => {},
    [ WebSocketServer.Signal.CLOSE ]: () => {},
    [ WebSocketServer.Signal.CONNECTION ]: ([ client ]) => {},
    [ WebSocketServer.Signal.HEADERS ]: ([ headers, req]) => {},
    [ WebSocketServer.Signal.Client.MESSAGE ]: ([ data, client, req ]) => console.log(data),
    [ WebSocketServer.Signal.Client.DISCONNECT ]: ([ code, reason ]) => console.log(`Client left with code ${ code }`),
});
const wss = new WebSocketServer(expressWs(app), network, {
    // unpacker: function(json) {        
    //     let obj = JSON.parse(json);

    //     while(typeof obj === "string" || obj instanceof String) {
    //         obj = JSON.parse(obj);
    //     }

    //     return obj;
    // }
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




//NOTE: Below is some SSL nonsense for when it comes to that
/**
 * Express/Windows/SSL
 * https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node
 * 
 * iOS Trust Store
 * https://apple.stackexchange.com/questions/123988/how-to-add-a-crt-certificate-to-iphones-keychain
 */