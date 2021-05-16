import WebSocket from "isomorphic-ws";

import Packets from "./Packets";
import Network from "../../event/Network";
import Message from "../../event/Message";

export class Client extends Network {
    static Signal = {
        CLOSE: "WebSocketClient.Close",
        ERROR: "WebSocketClient.Error",
        MESSAGE: "WebSocketClient.Message",
        MESSAGE_ERROR: "WebSocketClient.MessageError",
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

    constructor(state = {}, modify = {}, opts = {}) {
        super(state, modify);

        this.middleware = {
            pack: opts.pack,
            unpack: opts.unpack,
        };

        if (opts.connect === true) {
            this.connect(opts);
        }
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

    _bind(client) {
        client.addEventListener("close", (code, reason) => this.message(Client.Signal.CLOSE, code, reason));
        client.addEventListener("error", (error) => this.message(Client.Signal.ERROR, error));
        client.addEventListener("message", (packet) => {
            try {
                let msg;
                if (typeof this.middleware.unpack === "function") {
                    const { type, payload } = this.middleware.unpack.call(this, packet);

                    msg = Message.Generate(this, type, ...payload);
                } else {
                    msg = packet;
                }

                this.message(Client.Signal.MESSAGE, msg);
            } catch (e) {
                this.message(Client.Signal.MESSAGE_ERROR, e, packet);
            }
        });
        client.addEventListener("open", () => this.message(Client.Signal.OPEN));
        client.addEventListener("ping", (data) => this.message(Client.Signal.PING, data));
        client.addEventListener("pong", (data) => this.message(Client.Signal.PONG, data));
        client.addEventListener("unexpected-response", (req, res) => this.message(Client.Signal.UNEXPECTED_RESPONSE, req, res));
        client.addEventListener("upgrade", (res) => this.message(Client.Signal.UPGRADE, res));
    }

    get url() {
        return this.connection._url;
    }
    get readiness() {
        return this.connection.readyState;
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

    sendToServer(event, ...payload) {
        if (this.isConnected) {
            let data;
            if (typeof this.middleware.pack === "function") {
                if (Message.Conforms(event)) {
                    data = this.middleware.pack.call(this, event.type, ...event.data);
                } else {
                    data = this.middleware.pack.call(this, event, ...payload);
                }
            } else {
                data = [ event, payload ];
            }

            this.connection.send(data);

            return true;
        }

        return false;
    }

    disconnect(code, reason, timeout = false) {
        this.connection.close(code, reason);

        if (typeof timeout === "number" && timeout > 0) {
            setTimeout(() => {
                try {
                    if (!this.isClosed) {
                        this.kill();
                    }
                } catch (e) {
                    this.message(Client.Signal.ERROR, e);
                }
            }, timeout);
        }
    }
    kill() {
        this.connection.terminate();
    }


    static QuickSetup(wsOpts = {}, handlers = {}, { state = {}, packets = Packets.Json(), broadcastMessages = true } = {}) {
        const wsRelay = (msg, { message, broadcast, network }) => {
            if (broadcastMessages) {
                broadcast(msg);
            } else {
                message(Message.Generate(network, Network.Signal.RELAY, msg));
            }
        };

        const client = new this(state, {
            default: {
                [ Client.Signal.CLOSE ]: wsRelay,
                [ Client.Signal.ERROR ]: wsRelay,
                [ Client.Signal.MESSAGE ]: wsRelay,
                [ Client.Signal.MESSAGE_ERROR ]: wsRelay,
                [ Client.Signal.OPEN ]: wsRelay,
                [ Client.Signal.PING ]: wsRelay,
                [ Client.Signal.PONG ]: wsRelay,
                [ Client.Signal.UNEXPECTED_RESPONSE ]: wsRelay,
                [ Client.Signal.UPGRADE ]: wsRelay,
                [ Client.Signal.MESSAGE ]: ({ data }, { message, broadcast }) => {
                    const [ msg ] = data;

                    if (broadcastMessages) {
                        broadcast(msg);
                    } else {
                        message(msg);
                    }
                },

                ...handlers,
            },
        }, {
            ...wsOpts,
            ...packets,
        });

        client.modify({
            default: {
                $globals: {
                    sendToServer: client.sendToServer.bind(client),
                },
            },
        });

        return client;
    };
};

export const QuickSetup = Client.QuickSetup;

export default Client;