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