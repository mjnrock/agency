"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Proposition = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bitwise = require("../util/Bitwise");

var _Bitwise2 = _interopRequireDefault(_Bitwise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Proposition = exports.Proposition = function () {
    function Proposition() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Proposition);

        this.mask = _Bitwise2.default.add.apply(_Bitwise2.default, [0].concat(_toConsumableArray(flags)));
        this.props = props;
    }

    _createClass(Proposition, [{
        key: "test",
        value: function test() {
            var bool = void 0;
            if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.AND)) {
                bool = true;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var prop = _step.value;

                        if (typeof prop === "function") {
                            bool = bool && prop.apply(undefined, arguments);
                        } else if (prop instanceof Proposition) {
                            bool = bool && prop.test.apply(prop, arguments);
                        } else {
                            bool = bool && !!prop;
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
            } else {
                bool = false;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _prop = _step2.value;

                        if (typeof _prop === "function") {
                            bool = bool || _prop.apply(undefined, arguments);
                        } else if (_prop instanceof Proposition) {
                            bool = bool || _prop.test.apply(_prop, arguments);
                        } else {
                            bool = bool || !!_prop;
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
            }

            if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.NOT)) {
                return !bool;
            }

            return bool;
        }
    }, {
        key: "add",
        value: function add() {
            var _props;

            (_props = this.props).push.apply(_props, arguments);

            return this;
        }
    }, {
        key: "remove",
        value: function remove() {
            for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                props[_key] = arguments[_key];
            }

            this.props = this.props.filter(function (p) {
                return !props.includes(p);
            });

            return this;
        }
    }, {
        key: "toObject",
        value: function toObject() {
            var obj = {
                type: _Bitwise2.default.has(this.mask, Proposition.EnumFlags.AND) ? "and" : "or",
                props: this.props.map(function (p) {
                    if (p instanceof Proposition) {
                        return p.toObject();
                    }

                    return p;
                })
            };

            obj.type = _Bitwise2.default.has(this.mask, Proposition.EnumFlags.NOT) ? "n" + obj.type : obj.type;

            return obj;
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return JSON.stringify(this.toObject());
        }
    }], [{
        key: "FromObject",
        value: function FromObject() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var proposition = new Proposition();

            if (obj.type === "or") {
                proposition.mask = 0;
            } else if (obj.type === "and") {
                proposition.mask = _Bitwise2.default.add(0, Proposition.EnumFlags.AND);
            } else if (obj.type === "nor") {
                proposition.mask = _Bitwise2.default.add(0, Proposition.EnumFlags.NOT);
            } else if (obj.type === "nand") {
                proposition.mask = _Bitwise2.default.add(0, Proposition.EnumFlags.AND, Proposition.EnumFlags.NOT);
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = obj.props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var prop = _step3.value;

                    if ((typeof prop === "undefined" ? "undefined" : _typeof(prop)) === "object" && "type" in prop && "isNegation" in prop && "props" in prop) {
                        proposition.add(Proposition.FromObject(prop));
                    } else {
                        proposition.add(prop);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return proposition;
        }
    }, {
        key: "FromJson",
        value: function FromJson() {
            var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            try {
                var obj = json;
                while (typeof obj === "string" || obj instanceof String) {
                    obj = JSON.parse(obj);
                }

                return Proposition.FromObject(obj);
            } catch (e) {
                return false;
            }
        }
    }, {
        key: "OR",
        value: function OR() {
            for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                props[_key2] = arguments[_key2];
            }

            return new Proposition(props);
        }
    }, {
        key: "AND",
        value: function AND() {
            for (var _len3 = arguments.length, props = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                props[_key3] = arguments[_key3];
            }

            return new Proposition(props, [Proposition.EnumFlags.AND]);
        }
    }, {
        key: "NOR",
        value: function NOR() {
            for (var _len4 = arguments.length, props = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                props[_key4] = arguments[_key4];
            }

            return new Proposition(props, [Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "NAND",
        value: function NAND() {
            for (var _len5 = arguments.length, props = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                props[_key5] = arguments[_key5];
            }

            return new Proposition(props, [Proposition.EnumFlags.AND, Proposition.EnumFlags.NOT]);
        }
    }]);

    return Proposition;
}();

Proposition.EnumFlags = {
    NOT: 2 << 1,
    AND: 2 << 2
};
;

exports.default = Proposition;