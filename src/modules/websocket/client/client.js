import Client from "./../Client";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const client = new Client({
    url: `ws://localhost:3001`,
    // protocol: `ws`,
    // host: `localhost`,
    // port: 3001,
});