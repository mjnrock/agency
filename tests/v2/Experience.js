import Value from "./Value";

export default class Experience extends Value {
    constructor(value, { level = 1, formula, ...opts } = {}) {
        super(value, { softMax: true, min: 0, ...opts });

        this._formula = formula || this.__default;  // @formula is used to calculate this.max
        this.level = level;

        this.recalculate();
    }

    __default(level) {
        return level * 1000;
    }

    get onMax() {
        return this._onmax;
    }
    set onMax(fn) {
        if(typeof fn === "function") {
            this._onmax = fn;
        }

        return this;
    }

    get current() {
        return super.current;
    }
    set current(value) {
        super.current = value;

        if(!Number.isNaN(+this._max) && this._current >= this._max) {
            this._onmax();
        }

        return this;
    }

    get formula() {
        if(this._formula) {
            return this._formula;
        }

        return this.__default;
    }
    set formula(fn) {
        if(typeof fn === "function") {
            this._formula = fn;
        }

        this._formula = this.__default;
    }

    get total() {
        let xp = this.current;
        for(let i = 1; i < this.level; i++) {
            xp += this.formula(i);
        }

        return xp;
    }

    recalculate() {
        this.max = this.formula.call(this, this.level);
    }
    alter({ level = 1, xp = 0 } = {}) {
        this.level = level;
        this.current = xp;

        this.recalculate();
    }

    _onmax() {
        if(this.current >= this.max) {
            this._current -= this.max;
        } else {
            return;
        }

        this.level += 1;
        this.recalculate();
        this.next("level", this.level);

        if(this.current >= this.max) {
            this._onmax();
        }
    }

    toData() {
        return {
            ...super.toData(),
            level: this.level,
        }
    }
}