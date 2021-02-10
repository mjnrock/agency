import { v4 as uuidv4 } from "uuid";
import Node from "./Node";

export default class Registry {
    constructor() {
        this._id = uuidv4();
    }
};