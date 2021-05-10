import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export class Message {
    constructor(emitter, type, ...args) {
        this.id = uuidv4();
        this.type = type;
        this.data = args;
        this.emitter = emitter;
        this.provenance = new Set([ emitter ]);
        this.timestamp = Date.now();

        //  Basic proxy traps to prevent direct reassignment, but doesn't prevent nested object modification (e.g. provenance)
        return new Proxy(this, {
            get(target, prop) {
                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
                return Reflect.set(target, prop, target[ prop ]);
            },
        });
    }

    toObject() {
        return Object.assign({}, this);
    }
    toJSON() {
        return JSON.stringify(this.toObject());
    }

    getHash(algorithm = "md5", digest = "hex") {
        return crypto.createHash(algorithm).update(this.toJSON()).digest(digest);
    }

    static Generate(emitter, type, ...args) {
        if(Message.Conforms(type)) {
            return new Message(emitter.emitter, emitter.type, ...emitter.data);
        }

        return new Message(emitter, type, ...args);
    }

    static Conforms(obj) {
        if(typeof obj !== "object") {
            return false;
        }
        
        return "id" in obj
            && "type" in obj
            && "data" in obj
            && "emitter" in obj
            && "provenance" in obj
            && "timestamp" in obj;
    }
    static ConformsBasic(obj) {
        if(typeof obj !== "object") {
            return false;
        }

        return "type" in obj
            && "data" in obj
            && "emitter" in obj;
    }

    static FromObject(obj) {
        return Message.FromJSON(obj);
    }
    static FromJSON(json, maxDepth = 10) {
        try {
            let obj = json;
    
            let i = 0;
            while((typeof obj === "string" || obj instanceof String) && i < maxDepth) {
                obj = JSON.parse(json);
                ++i;
            }

            const message = new Message(obj.emitter, obj.type, ...obj.data);
            message.id = obj.id;
            message.provenance = new Set(obj.provenance);
            message.timestamp = obj.timestamp;

            return message;
        } catch(e) {}

        return false;
    }
};

export default Message;