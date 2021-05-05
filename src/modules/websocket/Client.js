import WebSocket from "ws";

import Packets from "./Packets";
import { BasicNetwork } from "../../event/Network";
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

        if(typeof opts.packer === "function") {
            this._packer = opts.packer;
        }
        if(typeof opts.unpacker === "function") {
            this._unpacker = opts.unpacker;
        }
        
        if(opts.connect === true) {
            this.connect(opts);
        }
    }

    connect({ url, host, protocol = "http", port, opts = {} } = {}) {
        if(host && protocol && port) {
            this.connection = new WebSocket(`${ protocol }://${ host }:${ port }`, opts);
        } else {
            this.connection = new WebSocket(url, opts);
        }

        this._bind(this.connection);

        return this;
    }

    _bind(client) {
        client.on("close", (code, reason) => this.dispatch(Client.Signal.CLOSE, code, reason));
        client.on("error", (error) => this.dispatch(Client.Signal.ERROR, error));
        client.on("message", (data) => {
            try {
                let payload;
                if(typeof this._unpacker === "function") {
                    payload = this._unpacker.call(this, data);
                } else {
                    payload = data;
                }
                
                this.dispatch(Client.Signal.MESSAGE, payload);
            } catch(e) {
                this.dispatch(Client.Signal.MESSAGE_ERROR, e, data);
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
        if(this.isOpen) {
            let payload
            if(typeof this._packer === "function") {
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
export function QuickSetup(opts = {}, handlers = {}, { packets = Packets.Json() } = {}) {
    /**
     * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
     *  as a single-route (firstMatch), single-context (named "default") network
     *  with real-time processing.
     */
    const network = new BasicNetwork({
        /**
         * Client handlers
         */
        [ Client.Signal.CLOSE ]: ([ code, reason ]) => console.warn(`Client has disconnected [${ code }] from`, client.url),
        [ Client.Signal.ERROR ]: ([ error ]) => {},
        [ Client.Signal.MESSAGE ]: ([{ type, data }], { client }) => {
            if(!Array.isArray(data)) {
                data = [ data ];
            }

            console.log(type, data)
    
            network.emit(client, type, ...data);
        },
        [ Client.Signal.OPEN ]: ([], { client }) => {
            console.warn(`Client has connected to`, client.url);

            client.send("cycle", Date.now());
        },
        [ Client.Signal.PING ]: ([ data ]) => {},
        [ Client.Signal.PONG ]: ([ data ]) => {},
        [ Client.Signal.UNEXPECTED_RESPONSE ]: ([ req, res ]) => {},
        [ Client.Signal.UPGRADE ]: ([ res ]) => {},
    
        /**
         * Unpacked Client.Signal.MESSAGE handlers
         */
        ...handlers,
    });

    const client = new Client(network, {
        ...packets,
        ...opts,
    });

    /**
     * Load @client into the global store for use in handlers
     */
    network.storeGlobal({
        client: client,
        network: network,
    });

    return client;
}

export default Client;