"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Context = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;

var _Observable2 = require("./Observable");

var _Observable3 = _interopRequireDefault(_Observable2);

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//TODO  Consider expanding the rules to allow something similar to a CSS Selector/DB Query system for props
/**
 *  "*" can be used to assign the "default rule", which must be true for ALL assignments, if present
 */
var Context = exports.Context = function (_Observable) {
    _inherits(Context, _Observable);

    function Context() {
        var _ret;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$rules = _ref.rules,
            rules = _ref$rules === undefined ? {} : _ref$rules,
            _ref$refs = _ref.refs,
            refs = _ref$refs === undefined ? {} : _ref$refs,
            _ref$deep = _ref.deep,
            deep = _ref$deep === undefined ? true : _ref$deep;

        _classCallCheck(this, Context);

        var _this = _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).call(this, false, { noWrap: true }));

        _this.__rules = new Map();
        _this.__references = new Map();

        _this.__add(rules);
        _this.__include(refs);

        return _ret = new Proxy(_this, {
            get: function get(target, prop) {
                if ((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    var props = prop.split(".");

                    if (props[0] === "$") {
                        props = props.slice(1);
                    }

                    var result = target;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var p = _step.value;

                            if (result[p] !== void 0) {
                                result = result[p];
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

                    return result;
                }

                return target[prop];
            },
            set: function set(target, prop, value) {
                var newValue = value;

                if (target.__defaultRule(newValue, target[prop], { prop: prop, target: target }) !== true) {
                    return target;
                }

                var rule = target.__rules.get(prop);
                if (typeof rule === "function") {
                    if (rule(newValue, target[prop], { prop: prop, target: target }) !== true) {
                        return target;
                    }
                } else if (rule instanceof _Proposition2.default) {
                    if (rule.test(newValue, target[prop], { prop: prop, target: target }) !== true) {
                        return target;
                    }
                }

                if ((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    var props = prop.split(".");

                    if (props[0] === "$") {
                        props = props.slice(1);
                    }

                    var result = target;
                    for (var i = 0; i < props.length; i++) {
                        var p = props[i];

                        if (i < props.length - 1) {
                            result = result[p];
                        } else {
                            result[p] = newValue;

                            target.next(prop, result[p]);
                        }
                    }

                    return target;
                }

                if (deep && ((typeof newValue === "undefined" ? "undefined" : _typeof(newValue)) === "object" || value instanceof _Observable3.default)) {
                    var obs = _Observable3.default.Factory(newValue);
                    obs.next = function () {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        var props = [prop].concat(_toConsumableArray(args.slice(0, args.length - 1))).join(".");

                        target.next(props, args.pop());
                    };

                    target[prop] = obs;
                } else {
                    target[prop] = newValue;
                }

                target.next(prop, target[prop]);

                return target;
            }
        }), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Context, [{
        key: "__defaultRule",
        value: function __defaultRule() {
            var rule = this.__rules.get("*");
            if (typeof rule === "function") {
                return rule.apply(undefined, arguments);
            } else if (rule instanceof _Proposition2.default) {
                return rule.test.apply(rule, arguments);
            }

            return true;
        }
    }, {
        key: "__",
        value: function __(key) {
            return this.__references.get(key);
        }
    }, {
        key: "__add",
        value: function __add(dotKey, proposition) {
            if ((typeof dotKey === "undefined" ? "undefined" : _typeof(dotKey)) === "object") {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Object.entries(dotKey)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _slicedToArray(_step2.value, 2),
                            key = _step2$value[0],
                            value = _step2$value[1];

                        this.__rules.set(key, value);
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
            } else {
                this.__rules.set(dotKey, proposition);
            }

            return this;
        }
    }, {
        key: "__remove",
        value: function __remove(dotKey) {
            this.__rules.delete(dotKey);

            return this;
        }
    }, {
        key: "__include",
        value: function __include(name, variable) {
            if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = Object.entries(name)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _step3$value = _slicedToArray(_step3.value, 2),
                            key = _step3$value[0],
                            value = _step3$value[1];

                        this.__references.set(key, value);
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
            } else {
                this.__references.set(name, variable);
            }

            return this;
        }
    }, {
        key: "__exclude",
        value: function __exclude(name) {
            this.__references.delete(name);

            return this;
        }
    }]);

    return Context;
}(_Observable3.default);

;

//? Use the .Factory method to create a <Context> with default state
function Factory() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$rules = _ref2.rules,
        rules = _ref2$rules === undefined ? {} : _ref2$rules,
        _ref2$refs = _ref2.refs,
        refs = _ref2$refs === undefined ? {} : _ref2$refs,
        deep = _ref2.deep;

    var ctx = new Context({ rules: rules, refs: refs, deep: deep });

    if (state instanceof Context) {
        state = state.toData();
    }

    if ((typeof state === "undefined" ? "undefined" : _typeof(state)) === "object") {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = Object.entries(state)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _step4$value = _slicedToArray(_step4.value, 2),
                    key = _step4$value[0],
                    value = _step4$value[1];

                ctx[key] = value;
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

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = Object.entries(rules)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _step5$value = _slicedToArray(_step5.value, 2),
                dotKey = _step5$value[0],
                proposition = _step5$value[1];

            ctx.__add(dotKey, proposition);
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

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = Object.entries(refs)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _step6$value = _slicedToArray(_step6.value, 2),
                name = _step6$value[0],
                variable = _step6$value[1];

            ctx.__include(name, variable);
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

    return ctx;
};

Context.Factory = Factory;

exports.default = Context;