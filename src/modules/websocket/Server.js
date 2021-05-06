import Packets from "./Packets";
import { BasicNetwork } from "../../event/Network";
import Dispatcher from "../../event/Dispatcher";

export class Server extends Dispatcher {
    static Signal = {
        LISTENING: "WebSocketServer.Listening",
        CLOSE: "WebSocketServer.Close",
        CONNECTION: "WebSocketServer.Connection",
        HEADERS: "WebSocketServer.Headers",

        Client: {
            MESSAGE: "WebSocketServer.Client.Message",
            MESSAGE_ERROR: "WebSocketServer.Client.MessageError",
            DISCONNECT: "WebSocketServer.Client.Disconnect",
        }
    };

    constructor(wss, network, { packer, unpacker } = {}) {
        super(network);

        this.subject = this;
        this.wss = wss;

        if(typeof packer === "function") {
            this._packer = packer;
        }
        if(typeof unpacker === "function") {
            this._unpacker = unpacker;
        }

        this._bind(this.wss.getWss(), this.wss.app);
    }

    _bind(wss, app) {
        wss.on("listening", () => this.dispatch(Server.Signal.LISTENING));
        wss.on("close", () => this.dispatch(Server.Signal.CLOSE));
        wss.on("connection", (client) => this.dispatch(Server.Signal.CONNECTION, client));
        wss.on("headers", (headers, req) => this.dispatch(Server.Signal.HEADERS, headers, req));

        app.ws("/", (client, req) => {
            client.on("message", (packet) => {
                try {
                    let msg;
                    if(typeof this._unpacker === "function") {
                        msg = this._unpacker.call(this, packet);
                    } else {
                        msg = packet;
                    }

                    this.dispatch(Server.Signal.Client.MESSAGE, msg, client, req);
                } catch(e) {
                    this.dispatch(Server.Signal.Client.MESSAGE_ERROR, e, packet, client, req);
                }
            });
            client.on("close", (code, reason) => this.dispatch(Server.Signal.Client.DISCONNECT, code, reason));
        });
    }

    get clients() {
        return this.wss.getWss().clients;
    }

    sendToClient(client, type, ...payload) {
        let msg;
        if(typeof this._packer === "function") {
            msg = this._packer.call(this, type, ...payload);
        } else {
            msg = payload;
        }

        client.send(msg);

        return this;
    }
    sendToAll(type, ...payload) {
        for(let client of this.clients) {
            this.sendToClient(client, type, ...payload);
        }

        return this;
    }
};

/**
 * Create a new <BasicNetwork> and a new <Server>, returning
 *  the newly created server.  The network can be accessed
 *  via << server.network >>.
 * 
 * The main convenience is that this setup will use the
 *  << Packets.JSON >> paradigm and setup the local
 *  message routing from packets received and unpackaged
 *  by the <Server>.  As such, the @handlers are those
 *  that should receive the unpackaged packets.
 */
export function QuickSetup(server, handlers = {}, { packets = Packets.Json() } = {}) {  
    /**
     * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
     *  as a single-route (firstMatch), single-context (named "default") network
     *  with real-time processing.
     */  
    const network = new BasicNetwork({
        /**
         * WebSocketClient handlers
         */
        [ Server.Signal.LISTENING ]: () => {},
        [ Server.Signal.CLOSE ]: () => {},
        [ Server.Signal.CONNECTION ]: ([ client ]) => {},
        [ Server.Signal.HEADERS ]: ([ headers, req ]) => {},
        [ Server.Signal.Client.MESSAGE ]: ([ { type, payload }, client, req ]) => {
            if(!Array.isArray(payload)) {
                payload = [ payload ];
            }

            console.log(type, payload)

            network.emit(client, type, ...payload);
        },
        [ Server.Signal.Client.DISCONNECT ]: ([ code, reason ]) => console.log(`Client left with code ${ code }`),
        
        ...handlers,
    });
    const wss = new Server(server, network, {
        ...packets,
    });

    network.storeGlobal({
        server: wss,
        network: network,
    });

    return wss;
};

export default Server;