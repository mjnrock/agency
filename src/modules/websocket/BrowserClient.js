import Client from "./Client";
import Packets from "./Packets";

export class BrowserClient extends Client {
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

    static QuickSetup(wsOpts = {}, handlers = {}, { state = {}, packets = Packets.Json(), broadcastMessages } = {}) {
        return super.QuickSetup.call(this, wsOpts, handlers, { state, packets, broadcastMessages });
    }
};

export default BrowserClient;