"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Proposition = function () {
    function Proposition() {
        _classCallCheck(this, Proposition);

        this._id = (0, _uuid.v4)();

        for (var _len = arguments.length, evaluators = Array(_len), _key = 0; _key < _len; _key++) {
            evaluators[_key] = arguments[_key];
        }

        this._evaluators = evaluators;
        this._mask = 0; // The logical group type (dysjunct, conjunct, negation)

        if (typeof evaluators[0] === "number") {
            this._mask = evaluators[0];
            this._evaluators = evaluators.slice(1);
        }
    }

    _createClass(Proposition, [{
        key: "add",
        value: function add() {
            for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                fns[_key2] = arguments[_key2];
            }

            this._evaluators = [].concat(_toConsumableArray(this._evaluators), fns);

            return this;
        }
    }, {
        key: "remove",
        value: function remove() {
            var _this = this;

            for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                fns[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var fn = _step.value;

                    _this._evaluators = _this._evaluators.filter(function (e) {
                        return e !== fn;
                    });
                };

                for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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

            return this;
        }
    }, {
        key: "run",
        value: function run() {
            var results = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._evaluators[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _fn = _step2.value;

                    if (typeof _fn === "function") {
                        results.push(_fn.apply(undefined, arguments));
                    } else if (_fn instanceof Proposition) {
                        results.push(_fn.run.apply(_fn, arguments));
                    } else {
                        throw new Error("@evaluator must be a function");
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var result = void 0;
            if ((this._mask & Proposition.GroupLogicType.CONJUNCT) === Proposition.GroupLogicType.CONJUNCT) {
                result = results.every(function (input) {
                    return input === true;
                });
            } else {
                result = results.some(function (input) {
                    return input === true;
                });
            }

            if ((this._mask & Proposition.GroupLogicType.NEGATION) === Proposition.GroupLogicType.NEGATION) {
                result = !result;
            }

            return result;
        }

        //* All static helpers assume that you put the meaningful arguments first

    }], [{
        key: "IsType",
        value: function IsType(type) {
            return new Proposition(function (t) {
                var _console;

                for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                    args[_key4 - 1] = arguments[_key4];
                }

                (_console = console).log.apply(_console, [t].concat(args));
                return type === t;
            });
        }
    }, {
        key: "IsPrimitiveType",
        value: function IsPrimitiveType(type) {
            return new Proposition(function (input) {
                return (typeof input === "undefined" ? "undefined" : _typeof(input)) === type;
            });
        }
    }, {
        key: "IsString",
        value: function IsString() {
            return new Proposition(function (input) {
                return typeof input === "string" || input instanceof String;
            });
        }
    }, {
        key: "IsNumber",
        value: function IsNumber() {
            return new Proposition(function (input) {
                return typeof input === "number";
            });
        }
    }, {
        key: "IsBoolean",
        value: function IsBoolean() {
            return new Proposition(function (input) {
                return typeof input === "boolean";
            });
        }
    }, {
        key: "IsTrue",
        value: function IsTrue() {
            return new Proposition(function (input) {
                return input === true;
            });
        }
    }, {
        key: "IsFalse",
        value: function IsFalse() {
            return new Proposition(function (input) {
                return input === false;
            });
        }
    }, {
        key: "IsFunction",
        value: function IsFunction() {
            return new Proposition(function (input) {
                return typeof input === "function";
            });
        }
    }, {
        key: "IsArray",
        value: function IsArray() {
            return new Proposition(function (input) {
                return Array.isArray(input);
            });
        }
    }, {
        key: "IsObject",
        value: function IsObject() {
            return new Proposition(function (input) {
                return (typeof input === "undefined" ? "undefined" : _typeof(input)) === "object";
            });
        }
    }, {
        key: "HasProps",
        value: function HasProps() {
            for (var _len5 = arguments.length, props = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                props[_key5] = arguments[_key5];
            }

            return new Proposition(function (input) {
                return (typeof input === "undefined" ? "undefined" : _typeof(input)) === "object" && props.every(function (prop) {
                    return prop in input;
                });
            });
        }
    }, {
        key: "IsGT",
        value: function IsGT(num) {
            return new Proposition(function (no) {
                return no > num;
            });
        }
    }, {
        key: "IsGTE",
        value: function IsGTE(num) {
            return new Proposition(function (no) {
                return no >= num;
            });
        }
    }, {
        key: "IsLT",
        value: function IsLT(num) {
            return new Proposition(function (no) {
                return no < num;
            });
        }
    }, {
        key: "IsLTE",
        value: function IsLTE(num) {
            return new Proposition(function (no) {
                return no <= num;
            });
        }
    }, {
        key: "IsBetween",
        value: function IsBetween(min, max) {
            return new Proposition(function (no) {
                return no >= min && no <= max;
            });
        }
    }]);

    return Proposition;
}();

Proposition.GroupLogicType = {
    CONJUNCT: 2 << 0,
    NEGATION: 2 << 1
};
exports.default = Proposition;
;