import Bitwise from "../util/Bitwise";

/**
 * If the masks XOR and NOT are both active, .test will interpret as XNOR
 */
export class Proposition {
    static EnumFlags = {
        NOT: 1 << 0,
        AND: 1 << 1,
        XOR: 1 << 2,
    };

    constructor(props = [], flags = []) {
        if(!Array.isArray(props)) {
            props = [ props ];
        }

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
        } else if(Bitwise.has(this.mask, Proposition.EnumFlags.XOR)) {        
            if(Bitwise.has(this.mask, Proposition.EnumFlags.NOT)) {
                //! This is interpreted as XNOR instead of !(XOR)--wrap this <Proposition> if !(XOR) is desired
                bool = [];
                for(let prop of this.props) {
                    let nextBool;
                    if(typeof prop === "function") {
                        nextBool = prop(...args);
                    } else if(prop instanceof Proposition) {
                        nextBool = prop.test(...args);
                    } else {
                        nextBool = !!prop;
                    }
    
                    bool.push(nextBool);
                }

                let first = !!bool[ 0 ];
                if(bool.every(b => b === first)) {
                    return true;
                }

                return false;
            } else {
                for(let prop of this.props) {
                    let nextBool;
                    if(typeof prop === "function") {
                        nextBool = prop(...args);
                    } else if(prop instanceof Proposition) {
                        nextBool = prop.test(...args);
                    } else {
                        nextBool = !!prop;
                    }
    
                    if(bool === true && nextBool === true) {
                        return false;
                    }

                    bool = bool || nextBool;
                }
            }
    
            return bool;
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

    static get TRUE() {
        return new Proposition(true);
    }
    static get FALSE() {
        return new Proposition(false);
    }
    static get NTRUE() {
        return new Proposition(true, [
            Proposition.EnumFlags.NOT,
        ]);
    }
    static get NFALSE() {
        return new Proposition(false, [
            Proposition.EnumFlags.NOT,
        ]);
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
    static XOR(...props) {
        return new Proposition(props, [
            Proposition.EnumFlags.XOR,
        ]);
    }
    static XNOR(...props) {
        return new Proposition(props, [
            Proposition.EnumFlags.XOR,
            Proposition.EnumFlags.NOT,
        ]);
    }
    static NXOR(...props) {
        return new Proposition([
            new Proposition(props, [
                Proposition.EnumFlags.XOR,
            ])
        ], [
            Proposition.EnumFlags.NOT,
        ]);
    }
    static NXNOR(...props) {
        return new Proposition([
            new Proposition(props, [
                Proposition.EnumFlags.XOR,
                Proposition.EnumFlags.NOT,
            ])
        ], [
            Proposition.EnumFlags.NOT,
        ]);
    }
};

export default Proposition;