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

    constructor(state = {}, alter = {}, opts = {}) {
        super(state, alter);

        this.middleware = {
            pack: opts.pack,
            unpack: opts.unpack,
        };

        if (opts.connect === true) {
            this.connect(opts);
        }
    }

    _bind(client) {
        client.addEventListener("close", (code, reason) => this.emit(Client.Signal.CLOSE, code, reason));
        client.addEventListener("error", (error) => this.emit(Client.Signal.ERROR, error));
        client.addEventListener("message", (packet) => {
            try {
                let msg;
                if (typeof this.middleware.unpack === "function") {
                    const { type, payload } = this.middleware.unpack.call(this, packet);

                    msg = Message.Generate(this, type, ...payload);
                } else {
                    msg = packet;
                }

                this.emit(Client.Signal.MESSAGE, msg);
            } catch (e) {
                this.emit(Client.Signal.MESSAGE_ERROR, e, packet);
            }
        });
        client.addEventListener("open", () => this.emit(Client.Signal.OPEN));
        client.addEventListener("ping", (data) => this.emit(Client.Signal.PING, data));
        client.addEventListener("pong", (data) => this.emit(Client.Signal.PONG, data));
        client.addEventListener("unexpected-response", (req, res) => this.emit(Client.Signal.UNEXPECTED_RESPONSE, req, res));
        client.addEventListener("upgrade", (res) => this.emit(Client.Signal.UPGRADE, res));
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
            if(typeof this.middleware.pack === "function") {
                if(Message.Conforms(event)) {
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
                    this.emit(Client.Signal.ERROR, e);
                }
            }, timeout);
        }
    }
    kill() {
        this.connection.terminate();
    }
    

    static QuickSetup(wsOpts = {}, handlers = {}, { state = {}, packets = Packets.Json(), broadcastMessages = true } = {}) {
        const wsRelay = (msg, { emit, broadcast, network }) => {
            if(broadcastMessages) {
                broadcast(msg);
            } else {
                emit(Message.Generate(network, Network.Signal.RELAY, msg));
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
                [ Client.Signal.MESSAGE ]: ({ data }, { emit, broadcast }) => {
                    const [ msg ] = data;

                    if(broadcastMessages) {
                        broadcast(msg);
                    } else {
                        emit(msg);
                    }
                },

                ...handlers,
            },
        },  {
            ...wsOpts,
            ...packets,
        });

        client.alter({
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