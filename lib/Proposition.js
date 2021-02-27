"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Proposition = exports.EnumPropositionType = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.OR = OR;
exports.AND = AND;
exports.NOT = NOT;
exports.NOR = NOR;
exports.NAND = NAND;
exports.IsGT = IsGT;
exports.IsGTE = IsGTE;
exports.IsLT = IsLT;
exports.IsLTE = IsLTE;
exports.IsBetween = IsBetween;
exports.IsPrimitiveType = IsPrimitiveType;
exports.IsString = IsString;
exports.IsNumber = IsNumber;
exports.IsBoolean = IsBoolean;
exports.IsTrue = IsTrue;
exports.IsFalse = IsFalse;
exports.IsFunction = IsFunction;
exports.IsArray = IsArray;
exports.IsObject = IsObject;
exports.HasProps = HasProps;
exports.InstanceOf = InstanceOf;
exports.IsObservable = IsObservable;
exports.IsObserver = IsObserver;
exports.IsBeacon = IsBeacon;
exports.IsProposition = IsProposition;
exports.IsMutator = IsMutator;

var _Mutator = require("./Mutator");

var _Mutator2 = _interopRequireDefault(_Mutator);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _Observer = require("./Observer");

var _Observer2 = _interopRequireDefault(_Observer);

var _Beacon = require("./Beacon");

var _Beacon2 = _interopRequireDefault(_Beacon);

var _Bitwise = require("./util/Bitwise");

var _Bitwise2 = _interopRequireDefault(_Bitwise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EnumPropositionType = exports.EnumPropositionType = {
    OR: 2 << 0,
    NOT: 2 << 1
};

var Proposition = exports.Proposition = function () {
    function Proposition(type) {
        _classCallCheck(this, Proposition);

        this.__type = type;

        for (var _len = arguments.length, evaluators = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            evaluators[_key - 1] = arguments[_key];
        }

        this.__evaluators = evaluators;
    }

    _createClass(Proposition, [{
        key: "test",
        value: function test() {
            var results = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.__evaluators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var evaluator = _step.value;

                    if (typeof evaluator === "function") {
                        results.push(evaluator.apply(undefined, arguments));
                    } else if (evaluator instanceof Proposition) {
                        results.push(evaluator.test.apply(evaluator, arguments));
                    } else if (evaluator instanceof _Mutator2.default) {
                        results.push(evaluator.process.apply(evaluator, arguments));
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var result = void 0;
            if (this.isAnd) {
                result = results.every(function (v) {
                    return v === true;
                });
            } else {
                result = results.some(function (v) {
                    return v === true;
                });
            }

            if (this.isNot) {
                result = !result;
            }

            return result;
        }
    }, {
        key: "isOr",
        get: function get() {
            return _Bitwise2.default.has(this.__type, EnumPropositionType.OR);
        }
    }, {
        key: "isAnd",
        get: function get() {
            return !_Bitwise2.default.has(this.__type, EnumPropositionType.OR);
        }
    }, {
        key: "isNot",
        get: function get() {
            return _Bitwise2.default.has(this.__type, EnumPropositionType.NOT);
        }
    }, {
        key: "isNor",
        get: function get() {
            return _Bitwise2.default.has(this.__type, EnumPropositionType.NOT, EnumPropositionType.OR);
        }
    }, {
        key: "isNand",
        get: function get() {
            return _Bitwise2.default.has(this.__type, EnumPropositionType.NOT, EnumPropositionType.AND);
        }
    }]);

    return Proposition;
}();

;

function OR() {
    for (var _len2 = arguments.length, evaluators = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        evaluators[_key2] = arguments[_key2];
    }

    return new (Function.prototype.bind.apply(Proposition, [null].concat([EnumPropositionType.OR], evaluators)))();
}
function AND() {
    for (var _len3 = arguments.length, evaluators = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        evaluators[_key3] = arguments[_key3];
    }

    return new (Function.prototype.bind.apply(Proposition, [null].concat([EnumPropositionType.AND], evaluators)))();
}
function NOT() {
    for (var _len4 = arguments.length, evaluators = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        evaluators[_key4] = arguments[_key4];
    }

    return new (Function.prototype.bind.apply(Proposition, [null].concat([EnumPropositionType.NOT], evaluators)))();
}
function NOR() {
    for (var _len5 = arguments.length, evaluators = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        evaluators[_key5] = arguments[_key5];
    }

    return new (Function.prototype.bind.apply(Proposition, [null].concat([EnumPropositionType.OR | EnumPropositionType.NOT], evaluators)))();
}
function NAND() {
    for (var _len6 = arguments.length, evaluators = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        evaluators[_key6] = arguments[_key6];
    }

    return new (Function.prototype.bind.apply(Proposition, [null].concat([EnumPropositionType.AND | EnumPropositionType.NOT], evaluators)))();
}

function IsGT(num) {
    return Proposition.OR(function (no) {
        return no > num;
    });
}
function IsGTE(num) {
    return Proposition.OR(function (no) {
        return no >= num;
    });
}
function IsLT(num) {
    return Proposition.OR(function (no) {
        return no < num;
    });
}
function IsLTE(num) {
    return Proposition.OR(function (no) {
        return no <= num;
    });
}
function IsBetween(min, max) {
    return Proposition.OR(function (no) {
        return no >= min && no <= max;
    });
}

function IsPrimitiveType(type) {
    return Proposition.OR(function (input) {
        return (typeof input === "undefined" ? "undefined" : _typeof(input)) === type;
    });
}
function IsString() {
    return Proposition.OR(function (input) {
        return typeof input === "string" || input instanceof String;
    });
}
function IsNumber() {
    return Proposition.OR(function (input) {
        return typeof input === "number";
    });
}
function IsBoolean() {
    return Proposition.OR(function (input) {
        return typeof input === "boolean";
    });
}
function IsTrue() {
    return Proposition.OR(function (input) {
        return input === true;
    });
}
function IsFalse() {
    return Proposition.OR(function (input) {
        return input === false;
    });
}
function IsFunction() {
    return Proposition.OR(function (input) {
        return typeof input === "function";
    });
}
function IsArray() {
    return Proposition.OR(function (input) {
        return Array.isArray(input);
    });
}
function IsObject() {
    return Proposition.OR(function (input) {
        return (typeof input === "undefined" ? "undefined" : _typeof(input)) === "object";
    });
}
function HasProps() {
    for (var _len7 = arguments.length, props = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        props[_key7] = arguments[_key7];
    }

    return Proposition.OR(function (input) {
        return (typeof input === "undefined" ? "undefined" : _typeof(input)) === "object" && props.every(function (prop) {
            return prop in input;
        });
    });
}

function InstanceOf(clazz) {
    return Proposition.OR(function (input) {
        return input instanceof clazz;
    });
}
function IsObservable() {
    return Proposition.OR(function (input) {
        return input instanceof _Observable2.default;
    });
}
function IsObserver() {
    return Proposition.OR(function (input) {
        return input instanceof _Observer2.default;
    });
}
function IsBeacon() {
    return Proposition.OR(function (input) {
        return input instanceof _Beacon2.default;
    });
}
function IsProposition() {
    return Proposition.OR(function (input) {
        return input instanceof Proposition;
    });
}
function IsMutator() {
    return Proposition.OR(function (input) {
        return input instanceof _Mutator2.default;
    });
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

Proposition.InstanceOf = InstanceOf;
Proposition.IsObservable = IsObservable;
Proposition.IsObserver = IsObserver;
Proposition.IsBeacon = IsBeacon;
Proposition.IsProposition = IsProposition;
Proposition.IsMutator = IsMutator;

exports.default = Proposition;