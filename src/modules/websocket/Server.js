import Dispatcher from "../../event/Dispatcher";

export class Server extends Dispatcher {
    static Signal = {
        LISTENING: "WebSocket.Listening",
        CLOSE: "WebSocket.Close",
        CONNECTION: "WebSocket.Connection",
        HEADERS: "WebSocket.Headers",

        Client: {
            MESSAGE: "WebSocket.Client.Message",
            DISCONNECT: "WebSocket.Client.Disconnect",
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
            client.on("message", (data) => this.dispatch(Server.Signal.Client.MESSAGE, data, client, req));
            client.on("close", (code, reason) => this.dispatch(Server.Signal.Client.DISCONNECT, code, reason));
        });
    }

    get clients() {
        return this.wss.getWss().clients;
    }
};

export default Server;