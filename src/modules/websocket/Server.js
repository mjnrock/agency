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

    constructor(wss, network) {
        super(network);

        this.subject = this;
        this.wss = wss;

        this._bind(this.wss.getWss(), this.wss.app);
    }

    _bind(wss, app) {
        wss.on("listening", () => this.dispatch(Server.Signal.LISTENING));
        wss.on("close", () => this.dispatch(Server.Signal.CLOSE));
        wss.on("connection", (client) => this.dispatch(Server.Signal.CONNECTION, client));
        wss.on("headers", (headers, req) => this.dispatch(Server.Signal.HEADERS, headers, req));

        app.ws("/", (client, req) => {
            client.on("message", (json) => {
                try {
                    let obj = JSON.parse(json);

                    while(typeof obj === "string" || obj instanceof String) {
                        obj = JSON.parse(obj);
                    }

                    this.dispatch(Server.Signal.Client.MESSAGE, obj, client, req);
                } catch(e) {
                    this.dispatch(Server.Signal.Client.MESSAGE_ERROR, json, client, req);
                }
            });
            client.on("close", (code, reason) => this.dispatch(Server.Signal.Client.DISCONNECT, code, reason));
        });
    }

    get clients() {
        return this.wss.getWss().clients;
    }
};

export default Server;