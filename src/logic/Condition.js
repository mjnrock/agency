import Proposition from "./Proposition";

export class Condition {
    constructor(prop, fn) {
        this.antecedent = prop;
        this.consequent = fn;
    }

    test(ifArgs = [], thenArgs = [], { returnResult = false } = {})  {
        let bool = false;

        if(typeof this.antecedent === "function" && this.antecedent(...ifArgs) === true) {
            bool = true;
        } else if(this.antecedent instanceof Proposition && this.antecedent.test(...ifArgs) === true) {
            bool = true;
        }
        
        if(bool === true) {
            let result = this.consequent(...thenArgs);
            if(returnResult) {
                return result;
            }
        }

        return bool;
    }

    toObject() {
        let obj = {
            antecedent: this.antecedent,
            consequent: this.consequent,
        };

        return obj;
    }
    toJson() {
        let obj = {
            antecedent: this.antecedent,
            consequent: this.consequent,
        };

        return JSON.stringify(obj, (key, value) => {
            if(key === "consequent") {
                return value.toString();
            }

            return value;
        });
    }

    static FromObject(obj = {}) {
        if(typeof obj.consequent === "string" || obj.consequent instanceof String) {
            obj.consequent = eval(obj.consequent);
        }
        
        if(obj.antecedent instanceof Proposition) {
            return new Condition(obj.antecedent, obj.consequent);
        }

        return new Condition(
            Proposition.FromObject(obj.antecedent),
            obj.consequent,
        );
    }
    static FromJson(json = "") {
        try {
            let obj = json;
            while(typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return Condition.FromObject(obj);
        } catch(e) {
            console.log(e)
            return false;
        }
    }
};

export default Condition;