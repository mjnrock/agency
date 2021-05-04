import { BasicNetwork } from "./../../../event/Network";

import Client from "./../Client";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

/**
 * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
 *  as a single-route (firstMatch), single-context (named "default") network
 *  with real-time processing.
 */
const network = new BasicNetwork({
    [ Client.Signal.CLOSE ]: ([ code, reason ]) => {},
    [ Client.Signal.ERROR ]: ([ error ]) => {},
    [ Client.Signal.MESSAGE ]: ([ data ]) => {},
    [ Client.Signal.OPEN ]: () => { 
        // client.binaryType = BinaryType.ArrayBuffer;
        client.send("test", "Hello");
    },
    [ Client.Signal.PING ]: ([ data ]) => {},
    [ Client.Signal.PONG ]: ([ data ]) => {},
    [ Client.Signal.UNEXPECTED_RESPONSE ]: ([ req, res ]) => {},
    [ Client.Signal.UPGRADE ]: ([ res ]) => {},
});

const client = new Client(network, {
    // url: `ws://localhost:3001`,
    protocol: `ws`,
    host: `localhost`,
    port: 3001,
});