import Mutator from "./Mutator";
import Observable from "./Observable";
import Observer from "./Observer";
import Beacon from "./Beacon";

import Bitwise from "./util/Bitwise";

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
            } else if(evaluator instanceof Mutator) {
                results.push(evaluator.process(...args));
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

export function IsPrimitiveType(type) {
    return Proposition.OR((input, ...args) => typeof input === type);
}
export function IsString() {
    return Proposition.OR((input, ...args) => typeof input === "string" || input instanceof String);
}
export function IsNumber() {
    return Proposition.OR((input, ...args) => typeof input === "number");
}
export function IsBoolean() {
    return Proposition.OR((input, ...args) => typeof input === "boolean");
}
export function IsTrue() {
    return Proposition.OR((input, ...args) => input === true);
}
export function IsFalse() {
    return Proposition.OR((input, ...args) => input === false);
}
export function IsFunction() {
    return Proposition.OR((input, ...args) => typeof input === "function");
}
export function IsArray() {
    return Proposition.OR((input, ...args) => Array.isArray(input));
}
export function IsObject() {
    return Proposition.OR((input, ...args) => typeof input === "object");
}
export function HasProps(...props) {
    return Proposition.OR((input, ...args) => typeof input === "object" && props.every(prop => prop in input));
}

export function IsObservable() {
    return Proposition.OR((input, ...args) => input instanceof Observable);
}
export function IsObserver() {
    return Proposition.OR((input, ...args) => input instanceof Observer);
}
export function IsBeacon() {
    return Proposition.OR((input, ...args) => input instanceof Beacon);
}
export function IsProposition() {
    return Proposition.OR((input, ...args) => input instanceof Proposition);
}
export function IsMutator() {
    return Proposition.OR((input, ...args) => input instanceof Mutator);
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

Proposition.IsPrimitiveType = IsPrimitiveType;
Proposition.IsString = IsString;
Proposition.IsNumber = IsNumber;
Proposition.IsBoolean = IsBoolean;
Proposition.IsTrue = IsTrue;
Proposition.IsFalse = IsFalse;
Proposition.IsFunction = IsFunction;
Proposition.IsArray = IsArray;
Proposition.IsObject = IsObject;
Proposition.HasProps = HasProps;

Proposition.IsObservable = IsObservable;
Proposition.IsObserver = IsObserver;
Proposition.IsBeacon = IsBeacon;
Proposition.IsProposition = IsProposition;
Proposition.IsMutator = IsMutator;

export default Proposition;