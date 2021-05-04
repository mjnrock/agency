import WebSocket from "ws";

import Dispatcher from "../../event/Dispatcher";

export class Client extends Dispatcher {
    static Signal = {
        CLOSE: "WebSocketClient.Close",
        ERROR: "WebSocketClient.Error",
        MESSAGE: "WebSocketClient.Message",
        OPEN: "WebSocketClient.Open",
        PING: "WebSocketClient.Ping",
        PONG: "WebSocketClient.Pong",
        UNEXPECTED_RESPONSE: "WebSocketClient.UnexpectedResponse",
        UPGRADE: "WebSocketClient.Upgrade",
    };

    static BinaryType = {
        NodeBuffer: "nodebuffer",
        ArrayBuffer: "arraybuffer",
        Fragments: "fragments",
    };

    constructor(network, { url, host, protocol = "http", port = 3001, opts = {} } = {}) {
        super(network);

        this.subject = this;

        if(host && protocol && port) {
            this.connection = new WebSocket(`${ protocol }://${ host }:${ port }`, opts);
        } else {
            this.connection = new WebSocket(url, opts);
        }

        // this.connection.binaryType = Client.BinaryType.NodeBuffer;
        this._bind(this.connection);
    }

    _bind(client) {
        client.on("close", (code, reason) => this.dispatch(Client.Signal.CLOSE, code, reason));
        client.on("error", (error) => this.dispatch(Client.Signal.ERROR, error));
        client.on("message", (data) => this.dispatch(Client.Signal.MESSAGE, data));
        client.on("open", () => this.dispatch(Client.Signal.OPEN));
        client.on("ping", (data) => this.dispatch(Client.Signal.PING, data));
        client.on("pong", (data) => this.dispatch(Client.Signal.PONG, data));
        client.on("unexpected-response", (req, res) => this.dispatch(Client.Signal.UNEXPECTED_RESPONSE, req, res));
        client.on("upgrade", (res) => this.dispatch(Client.Signal.UPGRADE, res));
    }

    send(event, ...args) {
        let json = JSON.stringify({
            from: this.id,
            payload: {
                type: event,
                data: args,
            },
            timestamp: Date.now(),
        });

        this.connection.send(json);
    }
};

export default Client;