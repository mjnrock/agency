import Packets from "./Packets";
import Network from "../../event/Network";
import Dispatcher from "../../event/Dispatcher";
import Message from "../../event/Message";

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
                    this.dispatch(Client.Signal.ERROR, e);
                }
            }, timeout);
        }
    }
    kill() {
        this.connection.terminate();
    }

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
    static QuickSetup(opts = {}, handlers = {}, { state = {}, packets = Packets.NodeJson() } = {}) {
        /**
         * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
         *  as a single-route (firstMatch), single-channel (named "default") network
         *  with real-time processing.
         */
        const network = new Network(state, {
            default: {
                handlers: {
                    /**
                     * Client handlers
                     */
                    // [ Client.Signal.CLOSE ]: () => {},
                    // [ Client.Signal.ERROR ]: () => {},
                    [ Client.Signal.MESSAGE ]: ({ data }, { network }) => {
                        const [ msg ] = data;
    
                        network.emit(msg);
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
    
        const client = new this(network, {
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
    };
};

export const QuickSetup = Client.QuickSetup;

export default Client;