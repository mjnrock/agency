import Bitwise from "./../util/Bitwise";

export const EnumPropositionType = {
    OR: 2 << 0,
    NOT: 2 << 1,
};

export class Proposition {
    constructor(type, ...evaluators) {
        this.__type = type;
        this.__evaluators = evaluators;
    }

    get isOr() {
        return Bitwise.has(this.__type, EnumPropositionType.OR);
    }
    get isAnd() {
        return !Bitwise.has(this.__type, EnumPropositionType.OR);
    }
    get isNot() {
        return Bitwise.has(this.__type, EnumPropositionType.NOT);
    }
    get isNor() {
        return Bitwise.has(this.__type, EnumPropositionType.NOT, EnumPropositionType.OR);
    }
    get isNand() {
        return Bitwise.has(this.__type, EnumPropositionType.NOT, EnumPropositionType.AND);
    }

    test(...args) {
        const results = [];
        for(let evaluator of this.__evaluators) {
            if(typeof evaluator === "function") {
                results.push(evaluator(...args));
            } else if(evaluator instanceof Proposition) {
                results.push(evaluator.test(...args));
            }
        }

        let result;
        if(this.isAnd) {
            result = results.every(v => v === true);
        } else {
            result = results.some(v => v === true);
        }
        
        if(this.isNot) {
            result = !result;
        }

        return result;
    }
};

export function OR(...evaluators) {
    return new Proposition(EnumPropositionType.OR, ...evaluators);
}
export function AND(...evaluators) {
    return new Proposition(EnumPropositionType.AND, ...evaluators);
}
export function NOT(...evaluators) {
    return new Proposition(EnumPropositionType.NOT, ...evaluators);
}
export function NOR(...evaluators) {
    return new Proposition(EnumPropositionType.OR | EnumPropositionType.NOT, ...evaluators);
}
export function NAND(...evaluators) {
    return new Proposition(EnumPropositionType.AND | EnumPropositionType.NOT, ...evaluators);
}

export function IsGT(num) {
    return Proposition.OR((no, ...args) => no > num);
}
export function IsGTE(num) {
    return Proposition.OR((no, ...args) => no >= num);
}
export function IsLT(num) {
    return Proposition.OR((no, ...args) => no < num);
}
export function IsLTE(num) {
    return Proposition.OR((no, ...args) => no <= num);
}
export function IsBetween(min, max) {
    return Proposition.OR((no, ...args) => no >= min && no <= max);
}

Proposition.OR = OR;
Proposition.AND = AND;
Proposition.NOT = NOT;
Proposition.NOR = NOR;
Proposition.NAND = NAND;

Proposition.IsGT = IsGT;
Proposition.IsGTE = IsGTE;
Proposition.IsLT = IsLT;
Proposition.IsLTE = IsLTE;
Proposition.IsBetween = IsBetween;

export default Proposition;