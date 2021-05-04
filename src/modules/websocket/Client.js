import WebSocket from "ws";

const client = new WebSocket(`ws://localhost:3001`);

const BinaryType = {
    NodeBuffer: "nodebuffer",
    ArrayBuffer: "arraybuffer",
    Fragments: "fragments",
};


client.on("open", () => {
    // client.binaryType = BinaryType.ArrayBuffer;
    client.send("Hello");
});
client.on("message", (...args) => {
    console.log(...args);
});
client.on("error", (...args) => {
    console.log("Error");
});
client.on("close", (...args) => {
    console.log("Goodbye");
});

export class Client {
    constructor({ url, host, protocol = "http", port = 3001 } = {}) {
        if(host && protocol && port) {
            this.connection = new WebSocket(`${ protocol }://${ host }:${ port }`);
        } else {
            this.connection = new WebSocket(url);
        }
    }
};

export default Client;