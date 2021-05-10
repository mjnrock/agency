import WebSocket from "ws";

import Packets from "./Packets";
import Network from "../../event/Network";
import Dispatcher from "../../event/Dispatcher";

export class Client extends Dispatcher {
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

    constructor(network, opts = {}) {
        super(network);

        this.subject = this;

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

    connect({ url, host, protocol = "http", port } = {}) {
        if (host && protocol && port) {
            this.connection = new WebSocket(`${ protocol }://${ host }:${ port }`);
        } else {
            this.connection = new WebSocket(url);
        }

        this._bind(this.connection);

        return this;
    }

    _bind(client) {
        client.on("close", (code, reason) => this.dispatch(Client.Signal.CLOSE, code, reason));
        client.on("error", (error) => this.dispatch(Client.Signal.ERROR, error));
        client.on("message", (packet) => {
            try {
                let msg;
                if (typeof this._unpacker === "function") {
                    msg = this._unpacker.call(this, packet);
                } else {
                    msg = packet;
                }

                this.dispatch(Client.Signal.MESSAGE, msg);
            } catch (e) {
                this.dispatch(Client.Signal.MESSAGE_ERROR, e, packet);
            }
        });
        client.on("open", () => this.dispatch(Client.Signal.OPEN));
        client.on("ping", (data) => this.dispatch(Client.Signal.PING, data));
        client.on("pong", (data) => this.dispatch(Client.Signal.PONG, data));
        client.on("unexpected-response", (req, res) => this.dispatch(Client.Signal.UNEXPECTED_RESPONSE, req, res));
        client.on("upgrade", (res) => this.dispatch(Client.Signal.UPGRADE, res));
    }

    get url() {
        return this.connection._url;
    }
    get readiness() {
        return this.connection.readyState;
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
        if (this.isConnected) {
            let payload
            if (typeof this._packer === "function") {
                payload = this._packer.call(this, event, ...args);
            } else {
                payload = [ event, ...args ];
            }

            this.connection.send(payload);

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
                    this.dispatch(Client.Signal.ERROR, e);
                }
            }, timeout);
        }
    }
    kill() {
        this.connection.terminate();
    }
};

/**
 * Create a new <BasicNetwork> and a new <Client>, returning
 *  the newly created client.  The network can be accessed
 *  via << client.network >>.
 * 
 * The main convenience is that this setup will use the
 *  << Packets.JSON >> paradigm and setup the local
 *  message routing from packets received and unpackaged
 *  by the <Client>.  As such, the @handlers are those 
 *  that should receive the unpackaged packets.
 */
export function QuickSetup(opts = {}, handlers = {}, { state = {}, packets = Packets.Json() } = {}) {
    /**
     * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
     *  as a single-route (firstMatch), single-channel (named "default") network
     *  with real-time processing.
     */
    const network = new Network(state, {
        $routes: [
            message => "default",
        ],
        default: {
            handlers: {
                /**
                 * Client handlers
                 */
                // [ Client.Signal.CLOSE ]: () => {},
                // [ Client.Signal.ERROR ]: () => {},
                [ Client.Signal.MESSAGE ]: ({ data }) => {
                    const [ { type, payload } ] = data;

                    network.emit(type, payload);
                },
                // [ Client.Signal.OPEN ]: (msg, { client }) => {
                //     console.warn(`Client has connected to`, client.url);

                //     client.send("bounce", Date.now());
                // },
                // [ Client.Signal.PING ]: () => {},
                // [ Client.Signal.PONG ]: () => {},
                // [ Client.Signal.UNEXPECTED_RESPONSE ]: () => {},
                // [ Client.Signal.UPGRADE ]: () => {},

                /**
                 * Unpacked Client.Signal.MESSAGE handlers
                 */
                ...handlers,
            },
        },
    });

    const client = new Client(network, {
        ...packets,
        ...opts,
    });

    network.alter({
        default: {
            globals: {
                client: client,
                network: network,
            },
        },
    });

    return client;
}

export default Client;