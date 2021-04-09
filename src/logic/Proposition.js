import Bitwise from "../util/Bitwise";

export class Proposition {
    static EnumFlags = {
        NOT: 2 << 1,
        AND: 2 << 2,
    };

    constructor(props = [], flags = []) {
        this.mask = Bitwise.add(0, ...flags);
        this.props = props;
    }

    test(...args) {
        let bool;
        if(Bitwise.has(this.mask, Proposition.EnumFlags.AND)) {
            bool = true;
            for(let prop of this.props) {
                if(typeof prop === "function") {
                    bool = bool && prop(...args);
                } else if(prop instanceof Proposition) {
                    bool = bool && prop.test(...args);
                } else {
                    bool = bool && !!prop;
                }
            }
        } else {
            bool = false;
            for(let prop of this.props) {
                if(typeof prop === "function") {
                    bool = bool || prop(...args);
                } else if(prop instanceof Proposition) {
                    bool = bool || prop.test(...args);
                } else {
                    bool = bool || !!prop;
                }
            }
        }
        
        if(Bitwise.has(this.mask, Proposition.EnumFlags.NOT)) {
            return !bool;
        }

        return bool;
    }

    add(...props) {
        this.props.push(...props);

        return this;
    }
    remove(...props) {
        this.props = this.props.filter(p => !props.includes(p));

        return this;
    }

    toObject() {
        let obj = {
            type: Bitwise.has(this.mask, Proposition.EnumFlags.AND) ? "and" : "or",
            props: this.props.map(p => {
                if(p instanceof Proposition) {
                    return p.toObject();
                }

                return p;
            }),
        };
        
        obj.type = Bitwise.has(this.mask, Proposition.EnumFlags.NOT) ? `n${ obj.type }` : obj.type;

        return obj;
    }
    toJson() {
        return JSON.stringify(this.toObject());
    }

    static FromObject(obj = {}) {
        const proposition = new Proposition();

        if(obj.type === "or") {
            proposition.mask = 0;
        } else if(obj.type === "and") {
            proposition.mask = Bitwise.add(0, Proposition.EnumFlags.AND);
        } else if(obj.type === "nor") {
            proposition.mask = Bitwise.add(0, Proposition.EnumFlags.NOT);
        } else if(obj.type === "nand") {
            proposition.mask = Bitwise.add(0, Proposition.EnumFlags.AND, Proposition.EnumFlags.NOT);
        }

        for(let prop of obj.props) {
            if(typeof prop === "object" && (
                "type" in prop
                && "isNegation" in prop
                && "props" in prop
            )) {
                proposition.add(Proposition.FromObject(prop));
            } else {
                proposition.add(prop);
            }
        }

        return proposition;
    }
    static FromJson(json = "") {
        try {
            let obj = json;
            while(typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return Proposition.FromObject(obj);
        } catch(e) {
            return false;
        }
    }

    static OR(...props) {
        return new Proposition(props);
    }
    static AND(...props) {
        return new Proposition(props, [
            Proposition.EnumFlags.AND,
        ]);
    }
    static NOR(...props) {
        return new Proposition(props, [
            Proposition.EnumFlags.NOT,
        ]);
    }
    static NAND(...props) {
        return new Proposition(props, [
            Proposition.EnumFlags.AND,
            Proposition.EnumFlags.NOT,
        ]);
    }
};

export default Proposition;