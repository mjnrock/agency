import crypto from "crypto";
import { v4 as uuidv4, validate } from "uuid";

export class Message {
	/**
	 * Both @data and @tags will be turned into arrays
	 * 	if they are not passed as such.  This can be
	 * 	used to streamline instantiating messages in
	 * 	the form of `(uuid, payload, type)`, for example.
	 */
    constructor(emitter, data = [], tags = [], { id, timestamp } = {}) {
		if(!Array.isArray(tags)) {
			tags = [ tags ];
		}
		if(!Array.isArray(data)) {
			data = [ data ];
		}

        this.id = validate(id) ? id : uuidv4();
        this.data = data;
        this.tags = new Set();
		this.timestamp = timestamp || Date.now();

		if(validate(emitter)) {
			this.tags.add(emitter);
		} else if(typeof emitter === "object" && validate(emitter.id)) {
			this.tags.add(emitter.id);
		}

		for(let tag of tags) {
			this.tags.add(tag);
		}

        //	Basic proxy traps to prevent direct reassignment, but doesn't prevent nested object modification (e.g. tags)
        return new Proxy(this, {
            get(target, prop) {
                return Reflect.get(target, prop);
            },
            set(target, prop, value) {
				return Reflect.set(target, prop, value);
            },
        });
    }

	get emitter() {
		return [ ...this.tags ][ 0 ];
	}

	tag(...tags) {
		for(let tag of tags) {
			this.tags.add(tag);
		}

		return [ ...this.tags ];
	}
	untag(...tags) {
		let results = [];
		for(let tag of tags) {
			results.push(this.tags.delete(tag));
		}
	
		return results;
	}
	every(...tags) {
		return tags.every(tag => this.tags.includes(tag));
	}
	some(...tags) {
		return tags.some(tag => this.tags.includes(tag));
	}
	has(tag) {
		return this.tags.includes(tag);
	}

	isFrom(potentialEmitter) {
		if(typeof potentialEmitter === "object") {
			return this.emitter === potentialEmitter.id;
		}

		return false;
	}

    toObject() {
        const obj = Object.assign({}, this);

		obj.tags = [ ...this.tags ];
		
		return obj;
    }
    toJson() {
        return JSON.stringify(this.toObject());
    }
    toString() {
        return this.toJson();
    }

    getHash(algorithm = "md5", digest = "hex") {
        return crypto.createHash(algorithm).update(this.toJson()).digest(digest);
    }
	get hash() {
		return this.getHash();
	}

    static Generate(emitter, data = [], tags = []) {
        if(Message.Conforms(emitter)) {
            return new Message(emitter.emitter, emitter.data, emitter.tags);
        } else if(Message.Conforms(data)) {
            return new Message(emitter, data.data, data.tags);
        }

        return new Message(emitter, data, tags);
    }

    static Conforms(obj) {
        if(typeof obj !== "object") {
            return false;
        }
        
        return "id" in obj
            && "data" in obj
            && "tags" in obj
            && "timestamp" in obj;
    }
    static ConformsBasic(obj) {
        if(typeof obj !== "object") {
            return false;
        }

        return "data" in obj
            && "tags" in obj;
    }

    static FromObject(obj) {
        return Message.FromJson(obj);
    }
    static FromJson(json, maxDepth = 10) {
        try {
            let obj = json;
    
            let i = 0;
            while((typeof obj === "string" || obj instanceof String) && i < maxDepth) {
                obj = JSON.parse(json);
                ++i;
            }

            const message = new Message(obj.emitter, obj.data, obj.tags, {
				id: obj.id,
				timestamp: obj.timestamp,
			});

            return message;
        } catch(e) {}

        return false;
    }
};

export default Message;