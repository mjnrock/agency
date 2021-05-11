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

        if (typeof opts.packer === "function") {
            this._packer = opts.packer;
        }
        if (typeof opts.unpacker === "function") {
            this._unpacker = opts.unpacker;
        }

        if (opts.connect === true) {
            this.connect(opts);
        }
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

    send(event, ...payload) {
        if (this.isConnected) {
            let data;
            if(typeof this._packer === "function") {
                if(Message.Conforms(event)) {
                    data = this._packer.call(this, event.type, ...event.data);
                } else {
                    data = this._packer.call(this, event, ...payload);
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

    static QuickSetup(wsOpts = {}, handlers = {}, { state = {}, packets = Packets.NodeJson(), clientClass = Client, broadcastMessages = true } = {}) {
        const client = new clientClass(state, {
            default: {
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
                    sendToServer: client.send.bind(client),
                },
            },
        })
    
        return client;
    };
};

export const QuickSetup = Client.QuickSetup;

export default Client;