import Client from "./Client";
import Packets from "./Packets";
import Network from "../../event/Network";

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
export function QuickSetup(opts = {}, handlers = {}, { state = {}, packets = Packets.BrowserJson() } = {}) {
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

    const client = new BrowserClient(network, {
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

export default BrowserClient;