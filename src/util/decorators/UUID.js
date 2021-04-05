import { v4 as uuidv4, validate } from "uuid";

export function UUID(uuid) {
    return target => {
        if(validate(uuid)) {
            target.__id = uuid;
        } else {
            target.__id = uuidv4();
        }

        Reflect.defineProperty(target, "id", {
            get() {
                return Reflect.get(target, "__id");
            },
            set(uuid) {
                return Reflect.set(target, "__id", uuid);
            },
        });

        return target;
    }
}