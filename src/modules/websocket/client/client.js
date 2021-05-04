import ws from "ws";

const client = new ws(`ws://localhost:3001`);

client.on("open", () => {
    client.send("Hello");
});
client.on("message", (...args) => {
    console.log(...args);
});