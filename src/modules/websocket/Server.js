import Packets from "./Packets";
import Network from "../../event/Network";
import Message from "../../event/Message";

export class Server extends Network {
    static Signal = {
        LISTENING: "WebSocketServer.Listening",
        CLOSE: "WebSocketServer.Close",
        CONNECTION: "WebSocketServer.Connection",
        HEADERS: "WebSocketServer.Headers",

        Client: {
            MESSAGE: "WebSocketServer.Client.Message",
            MESSAGE_ERROR: "WebSocketServer.Client.MessageError",
            DISCONNECT: "WebSocketServer.Client.Disconnect",
        }
    };

    constructor(wss, state = {}, alter = {}, opts = {}) {
        super(state, alter);

        this.wss = wss;

        if (typeof opts.packer === "function") {
            this._packer = opts.packer;
        }
        if (typeof opts.unpacker === "function") {
            this._unpacker = opts.unpacker;
        }

        this._bind(this.wss.getWss(), this.wss.app);

    }

    _bind(wss, app) {
        wss.on("listening", () => this.emit(Server.Signal.LISTENING));
        wss.on("close", () => this.emit(Server.Signal.CLOSE));
        wss.on("connection", (client) => this.emit(Server.Signal.CONNECTION, client));
        wss.on("headers", (headers, req) => this.emit(Server.Signal.HEADERS, headers, req));

        app.ws("/", (client, req) => {
            client.on("message", (packet) => {
                try {
                    let msg;                    
                    if(typeof this._unpacker === "function") {
                        const { type, payload } = this._unpacker.call(this, packet);

                        msg = Message.Generate(this, type, ...payload);
                    } else {
                        msg = packet;
                    }

                    this.emit(Server.Signal.Client.MESSAGE, msg, client, req);
                } catch(e) {
                    this.emit(Server.Signal.Client.MESSAGE_ERROR, e, packet, client, req);
                }
            });
            client.on("close", (code, reason) => this.emit(Server.Signal.Client.DISCONNECT, code, reason));
        });
    }

    get clients() {
        return this.wss.getWss().clients;
    }

    sendToClient(client, type, ...payload) {
        let msg;
        if(typeof this._packer === "function") {
            if(Message.ConformsBasic(type)) {
                msg = this._packer.call(this, type.type, ...type.data);
            } else {
                msg = this._packer.call(this, type, ...payload);
            }
        } else {
            msg = [ type, payload ];
        }

        client.send(msg);

        return this;
    }
    sendToAll(type, ...payload) {
        for(let client of this.clients) {
            this.sendToClient(client, type, ...payload);
        }

        return this;
    }
    

    static QuickSetup(wss, handlers = {}, { state = {}, packets = Packets.NodeJson(), broadcastMessages = true } = {}) {
        const server = new Server(wss, state, {
            default: {
                [ Server.Signal.Client.MESSAGE ]: ({ data }, { emit, broadcast }) => {
                    const [ msg ] = data;

                    if(broadcastMessages) {
                        broadcast(msg);
                    } else {
                        emit(msg);
                    }
                },
                
                ...handlers,
            },
        }, {
            ...packets,
        });

        server.alter({
            default: {
                $globals: {
                    sendToClient: server.sendToClient.bind(server),
                    sendToAll: server.sendToAll.bind(server),
                },
            },
        });
    
        return server;
    };
};

export const QuickSetup = Server.QuickSetup;

export default Server;