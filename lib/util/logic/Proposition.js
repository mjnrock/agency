"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Proposition = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bitwise = require("./../Bitwise");

var _Bitwise2 = _interopRequireDefault(_Bitwise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * If the masks XOR and NOT are both active, .test will interpret as XNOR
 */
var Proposition = exports.Proposition = function () {
    _createClass(Proposition, null, [{
        key: "TryFlags",
        value: function TryFlags() {
            var ret = [];

            for (var _len = arguments.length, pairs = Array(_len), _key = 0; _key < _len; _key++) {
                pairs[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        flag = _step$value[0],
                        boolOrFn = _step$value[1];

                    var result = void 0;
                    if (typeof boolOrFn === "function") {
                        result = boolOrFn();
                    } else {
                        result = !!boolOrFn;
                    }

                    if (result === true) {
                        ret.push(flag);
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

            return ret;
        }
    }]);

    function Proposition() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Proposition);

        if (!Array.isArray(props)) {
            props = [props];
        }

        this.mask = _Bitwise2.default.add.apply(_Bitwise2.default, [0].concat(_toConsumableArray(flags)));
        this.props = props;
    }

    _createClass(Proposition, [{
        key: "test",
        value: function test() {
            var bool = void 0;
            if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.AND)) {
                bool = true;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var prop = _step2.value;

                        if (typeof prop === "function") {
                            bool = bool && prop.apply(undefined, arguments);
                        } else if (prop instanceof Proposition) {
                            bool = bool && prop.test.apply(prop, arguments);
                        } else {
                            bool = bool && !!prop;
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
            } else if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.XOR)) {
                if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.NOT)) {
                    //! This is interpreted as XNOR instead of !(XOR)--wrap this <Proposition> if !(XOR) is desired
                    bool = [];
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = this.props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _prop = _step3.value;

                            var nextBool = void 0;
                            if (typeof _prop === "function") {
                                nextBool = _prop.apply(undefined, arguments);
                            } else if (_prop instanceof Proposition) {
                                nextBool = _prop.test.apply(_prop, arguments);
                            } else {
                                nextBool = !!_prop;
                            }

                            bool.push(nextBool);
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

                    var first = !!bool[0];
                    if (bool.every(function (b) {
                        return b === first;
                    })) {
                        return true;
                    }

                    return false;
                } else {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = this.props[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _prop2 = _step4.value;

                            var _nextBool = void 0;
                            if (typeof _prop2 === "function") {
                                _nextBool = _prop2.apply(undefined, arguments);
                            } else if (_prop2 instanceof Proposition) {
                                _nextBool = _prop2.test.apply(_prop2, arguments);
                            } else {
                                _nextBool = !!_prop2;
                            }

                            if (bool === true && _nextBool === true) {
                                return false;
                            }

                            bool = bool || _nextBool;
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }

                return bool;
            } else if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.IMPLICATION)) {
                var _props = _slicedToArray(this.props, 2),
                    left = _props[0],
                    right = _props[1];

                if (typeof left === "function") {
                    left = left.apply(undefined, arguments);
                } else if (left instanceof Proposition) {
                    var _left;

                    left = (_left = left).test.apply(_left, arguments);
                } else {
                    left = !!left;
                }

                if (typeof right === "function") {
                    right = right.apply(undefined, arguments);
                } else if (right instanceof Proposition) {
                    var _right;

                    right = (_right = right).test.apply(_right, arguments);
                } else {
                    right = !!right;
                }

                bool = !(left === true && right === false);
            } else {
                bool = false;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.props[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _prop3 = _step5.value;

                        if (typeof _prop3 === "function") {
                            bool = bool || _prop3.apply(undefined, arguments);
                        } else if (_prop3 instanceof Proposition) {
                            bool = bool || _prop3.test.apply(_prop3, arguments);
                        } else {
                            bool = bool || !!_prop3;
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
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
            var _props2;

            (_props2 = this.props).push.apply(_props2, arguments);

            return this;
        }
    }, {
        key: "remove",
        value: function remove() {
            for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                props[_key2] = arguments[_key2];
            }

            this.props = this.props.filter(function (p) {
                return !props.includes(p);
            });

            return this;
        }
    }, {
        key: "toObject",
        value: function toObject() {
            var type = void 0;
            if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.AND)) {
                type = "and";
            } else if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.XOR)) {
                type = "xor";
            } else if (_Bitwise2.default.has(this.mask, Proposition.EnumFlags.IMPLICATION)) {
                type = "imply";
            } else {
                type = "or";
            }

            var obj = {
                type: type,
                props: this.props.map(function (p) {
                    if (p instanceof Proposition) {
                        return p.toObject();
                    }

                    return p;
                }),
                isNegation: _Bitwise2.default.has(this.mask, Proposition.EnumFlags.NOT)
            };

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

            if (obj.type === "and") {
                proposition.mask = _Bitwise2.default.add(0, Proposition.EnumFlags.AND);
            } else if (obj.type === "xor") {
                proposition.mask = _Bitwise2.default.add(0, Proposition.EnumFlags.XOR);
            } else if (obj.type === "imply") {
                proposition.mask = _Bitwise2.default.add(0, Proposition.EnumFlags.IMPLICATION);
            } else {
                proposition.mask = 0;
            }

            if (obj.isNegation === true) {
                proposition.mask = _Bitwise2.default.add(proposition.mask, Proposition.EnumFlags.NOT);
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = obj.props[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var prop = _step6.value;

                    if ((typeof prop === "undefined" ? "undefined" : _typeof(prop)) === "object" && "type" in prop && "isNegation" in prop && "props" in prop) {
                        proposition.add(Proposition.FromObject(prop));
                    } else {
                        proposition.add(prop);
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
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
        key: "New",
        value: function New(props, flags) {
            return new Proposition(props, flags);
        }
    }, {
        key: "Test",
        value: function Test(props, flags) {
            var _Proposition$New;

            for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                args[_key3 - 2] = arguments[_key3];
            }

            return (_Proposition$New = Proposition.New(props, flags)).test.apply(_Proposition$New, args);
        }
    }, {
        key: "OR",
        value: function OR() {
            for (var _len4 = arguments.length, props = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                props[_key4] = arguments[_key4];
            }

            return new Proposition(props);
        }
    }, {
        key: "AND",
        value: function AND() {
            for (var _len5 = arguments.length, props = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                props[_key5] = arguments[_key5];
            }

            return new Proposition(props, [Proposition.EnumFlags.AND]);
        }
    }, {
        key: "IMPLY",
        value: function IMPLY(p, q) {
            return new Proposition([p, q], [Proposition.EnumFlags.IMPLICATION]);
        }
    }, {
        key: "NOT",
        value: function NOT() {
            for (var _len6 = arguments.length, props = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                props[_key6] = arguments[_key6];
            }

            return new Proposition(props, [Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "XOR",
        value: function XOR() {
            for (var _len7 = arguments.length, props = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                props[_key7] = arguments[_key7];
            }

            return new Proposition(props, [Proposition.EnumFlags.XOR]);
        }
    }, {
        key: "NOR",
        value: function NOR() {
            for (var _len8 = arguments.length, props = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                props[_key8] = arguments[_key8];
            }

            return new Proposition(props, [Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "NAND",
        value: function NAND() {
            for (var _len9 = arguments.length, props = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                props[_key9] = arguments[_key9];
            }

            return new Proposition(props, [Proposition.EnumFlags.AND, Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "XNOR",
        value: function XNOR() {
            for (var _len10 = arguments.length, props = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                props[_key10] = arguments[_key10];
            }

            return new Proposition(props, [Proposition.EnumFlags.XOR, Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "IFF",
        value: function IFF(left, right) {
            return Proposition.XNOR(left, right);
        }
    }, {
        key: "NXOR",
        value: function NXOR() {
            for (var _len11 = arguments.length, props = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                props[_key11] = arguments[_key11];
            }

            return new Proposition([new Proposition(props, [Proposition.EnumFlags.XOR])], [Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "NXNOR",
        value: function NXNOR() {
            for (var _len12 = arguments.length, props = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                props[_key12] = arguments[_key12];
            }

            return new Proposition([new Proposition(props, [Proposition.EnumFlags.XOR, Proposition.EnumFlags.NOT])], [Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "TRUE",
        get: function get() {
            return new Proposition(true);
        }
    }, {
        key: "FALSE",
        get: function get() {
            return new Proposition(false);
        }
    }, {
        key: "NOT_TRUE",
        get: function get() {
            return new Proposition(true, [Proposition.EnumFlags.NOT]);
        }
    }, {
        key: "NOT_FALSE",
        get: function get() {
            return new Proposition(false, [Proposition.EnumFlags.NOT]);
        }
    }]);

    return Proposition;
}();

Proposition.EnumFlags = {
    NOT: 1 << 0,
    AND: 1 << 1,
    XOR: 1 << 2,
    IMPLICATION: 1 << 3
};
;

exports.default = Proposition;