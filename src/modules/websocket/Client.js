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

    get readiness() {
        return this.connection.readyState;
    }
    get isConnecting() {
        return this.connection.readyState === WebSocket.CONNECTING;
    }
    get isOpen() {
        return this.connection.readyState === WebSocket.OPEN;
    }
    get isClosing() {
        return this.connection.readyState === WebSocket.CLOSING;
    }
    get isClosed() {
        return this.connection.readyState === WebSocket.CLOSED;
    }

    useNodeBuffer() {
        this.connection.binaryType = Client.BinaryType.NodeBuffer;

        return this;
    }
    useArrayBuffer() {
        this.connection.binaryType = Client.BinaryType.ArrayBuffer;

        return this;
    }
    useFragments() {
        this.connection.binaryType = Client.BinaryType.Fragments;

        return this;
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

    close(code, reason, timeout = false) {
        this.connection.close(code, reason);

        if(typeof timeout === "number" && timeout > 0) {
            setTimeout(() => {
                try {
                    if(!this.isClosed) {
                        this.kill();
                    }
                } catch(e) {
                    this.dispatch(Client.Signal.ERROR, e);
                }
            }, timeout);
        }
    }
    kill() {
        this.connection.terminate();
    }
};

export default Client;