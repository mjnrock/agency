import WebSocket from "ws";

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

    /**
     * A basic un/packer that utilized JSON
     */
    static JsonPackets = {        
        packer: function(event, ...args) {
            return JSON.stringify({
                payload: {
                    type: event,
                    data: args,
                },
                timestamp: Date.now(),
            });
        },
        unpacker: function(json) {        
            let obj = JSON.parse(json);

            while(typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return obj.payload;
        },
    };

    constructor(network, opts = {}) {
        super(network);

        this.subject = this;

        if(typeof opts.packer === "function") {
            this._packer = opts.packer;
        } else {
            this._packer = Client.JsonPackets.packer;
        }
        if(typeof opts.unpacker === "function") {
            this._unpacker = opts.unpacker;
        } else {
            this._unpacker = Client.JsonPackets.unpacker;
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

export default Client;