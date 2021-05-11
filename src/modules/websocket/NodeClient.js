import WebSocket from "ws";

import Client from "./Client";
import Packets from "./Packets";
import Message from "../../event/Message";

export class NodeClient extends Client {
    constructor(state = {}, alter = {}, opts = {}) {
        super(state, alter, opts);
    }

    connect({ url, host, protocol = "http", port, ws } = {}) {
        if (ws instanceof WebSocket) {
            this.connection = ws;
        } else if (host && protocol && port) {
            this.connection = new WebSocket(`${ protocol }://${ host }:${ port }`);
        } else {
            this.connection = new WebSocket(url);
        }

        this._bind(this.connection);

        return this;
    }

    _bind(client) {
        client.on("close", (code, reason) => this.emit(Client.Signal.CLOSE, code, reason));
        client.on("error", (error) => this.emit(Client.Signal.ERROR, error));
        client.on("message", (packet) => {
            try {
                let msg;
                if (typeof this._unpacker === "function") {
                    const { type, payload } = this._unpacker.call(this, packet);

                    msg = Message.Generate(this, type, ...payload);
                } else {
                    msg = packet;
                }
                
                this.emit(Client.Signal.MESSAGE, msg);
            } catch (e) {
                this.emit(Client.Signal.MESSAGE_ERROR, e, packet);
            }
        });
        client.on("open", () => this.emit(Client.Signal.OPEN));
        client.on("ping", (data) => this.emit(Client.Signal.PING, data));
        client.on("pong", (data) => this.emit(Client.Signal.PONG, data));
        client.on("unexpected-response", (req, res) => this.emit(Client.Signal.UNEXPECTED_RESPONSE, req, res));
        client.on("upgrade", (res) => this.emit(Client.Signal.UPGRADE, res));
    }

    get isConnecting() {
        return this.connection.readyState === WebSocket.CONNECTING;
    }
    get isConnected() {
        return this.connection.readyState === WebSocket.OPEN;
    }
    get isClosing() {
        return this.connection.readyState === WebSocket.CLOSING;
    }
    get isClosed() {
        return this.connection.readyState === WebSocket.CLOSED;
    }
    
    static QuickSetup(wsOpts = {}, handlers = {}, { state = {}, packets = Packets.NodeJson(), broadcastMessages } = {}) {
        return super.QuickSetup.call(this, wsOpts, handlers, { state, packets, clientClass: NodeClient, broadcastMessages });
    }
};

export default NodeClient;