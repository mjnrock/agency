import Client from "./Client";
import Packets from "./Packets";
import Message from "../../event/Message";

export class BrowserClient extends Client {
    constructor(network, opts = {}) {
        super(network, opts);
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
        client.addEventListener("close", (code, reason) => this.dispatch(Client.Signal.CLOSE, code, reason));
        client.addEventListener("error", (error) => this.dispatch(Client.Signal.ERROR, error));
        client.addEventListener("message", (packet) => {
            try {
                let msg;
                if (typeof this._unpacker === "function") {
                    const { type, payload } = this._unpacker.call(this, packet);
                    msg = Message.Generate(this, type, ...payload);
                } else {
                    msg = packet;
                }

                this.dispatch(Client.Signal.MESSAGE, msg);
            } catch (e) {
                this.dispatch(Client.Signal.MESSAGE_ERROR, e, packet);
            }
        });
        client.addEventListener("open", () => this.dispatch(Client.Signal.OPEN));
        client.addEventListener("ping", (data) => this.dispatch(Client.Signal.PING, data));
        client.addEventListener("pong", (data) => this.dispatch(Client.Signal.PONG, data));
        client.addEventListener("unexpected-response", (req, res) => this.dispatch(Client.Signal.UNEXPECTED_RESPONSE, req, res));
        client.addEventListener("upgrade", (res) => this.dispatch(Client.Signal.UPGRADE, res));
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

    static QuickSetup(opts = {}, handlers = {}, { state = {}, packets = Packets.BrowserJson() } = {}) {
        return super.QuickSetup.call(this, opts, handlers, { state, packets, clientClass: BrowserClient });
    }
};

export default BrowserClient;