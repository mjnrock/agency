import { v4 as uuidv4 } from "uuid";

export default class Message {
    constructor(type, payload, { id, timestamp } = {}) {
        this._id = id || uuidv4();
        this._timestamp = timestamp || Date.now();

        this.type = type;
        this.data = payload;
    }

    static ToObject(msg) {
        if(!(msg instanceof Message)) {
            return false;
        }

        return {
            _id: msg._id,
            _timestamp: msg._timestamp,
            type: msg.type,
            data: msg.data,
        }
    }
    static FromObject(obj) {
        if(typeof obj !== "object") {
            return false;
        }

        if(!("data" in obj && "type" in obj)) {
            return false;
        }

        return new Message(obj.type, obj.data, { id: obj._id, timestamp: obj._timestamp });
    }
}