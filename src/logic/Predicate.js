import Proposition from "./Proposition";

/**
 * This class probably doesn't need to exist, but here we are.
 * It serves a purpose in its own way.
 */
export class Predicate extends Proposition {
    constructor(fn, constants = []) {
        super(fn instanceof Proposition ? fn.props[ 0 ] : fn);

        this.constants = constants;
    }

    all(consequent, ...variables) {
        return Proposition.IMPLY(this, consequent).test(...this.constants, ...variables);
    }
    notAll(consequent, ...variables) {
        return Proposition.NOT(Proposition.IMPLY(this, consequent)).test(...this.constants, ...variables);
    }
    exists(conjunct, ...variables) {
        return Proposition.AND(this, conjunct).test(...this.constants, ...variables);
    }
    notExists(conjunct, ...variables) {
        return Proposition.NOT(Proposition.AND(this, conjunct)).test(...this.constants, ...variables);
    }

    static ALL(predicate, consequent, ...constants) {
        return Proposition.IMPLY(new Predicate(predicate, constants), consequent);
    }
    static NOT_ALL(predicate, consequent, ...constants) {
        return Proposition.NOT(Proposition.IMPLY(new Predicate(predicate, constants), consequent));
    }
    static EXISTS(predicate, conjunct, ...constants) {
        return Proposition.AND(new Predicate(predicate, constants), conjunct);
    }
    static NOT_EXISTS(predicate, conjunct, ...constants) {
        return Proposition.NOT(Proposition.AND(new Predicate(predicate, constants), conjunct));
    }
};

export default Predicate;