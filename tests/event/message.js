import Message from "./../../src/event/Message";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const message = new Message({ cat: 4 }, "test", 1, 2, 3);

console.log(message);

console.log(message.getHash());
message.id = 34543;
message.data = 34543;
message.data.push(89798);
message.provenance.add({ dog: 2 });

console.log(message);
console.log(message.getHash());