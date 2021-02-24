import EventEmitter from "events";
import Observable from "./Observable";
import Observer from "./Observer";

export class Channel extends EventEmitter {
    constructor() {
        super();

        this.members = new Map();
    }

    join(...members) {
        for(let member of members) {
            if(member instanceof Observable) {
                member = new Observer(member);
            }
            
            if(member instanceof Observer) {
                const fn = (props, value) => {
                    this.emit(props, value, member);
                    this.emit("next", props, value, member);
                };
                this.members.set(member.__id, { member, fn });

                member.on("next", fn);
            }
        }

        return this;
    }
    leave(...members) {
        for(let member of members) {
            if(member instanceof Observer) {
                const { fn } = this.members.get(member.__id) || {};

                if(typeof fn === "function") {
                    member.off("next", fn);
                }

                this.members.delete(member.__id);
            }
        }

        return this;
    }
}

export default Channel;