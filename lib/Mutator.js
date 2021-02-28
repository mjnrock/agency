"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Mutator = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mutator = exports.Mutator = function () {
    function Mutator() {
        var methods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var proposition = arguments[1];

        _classCallCheck(this, Mutator);

        if (proposition instanceof _Proposition2.default) {
            this.__proposition = proposition;
        } else if (typeof proposition === "function") {
            this.__proposition = _Proposition2.default.OR(proposition);
        } else {
            this.__proposition;
        }

        this.__methods = methods;
    }

    _createClass(Mutator, [{
        key: "add",
        value: function add(fn) {
            this.__methods.push(fn);

            return this;
        }
    }, {
        key: "remove",
        value: function remove(fn) {
            this.__methods = this.__methods.filter(function (f) {
                return f !== fn;
            });

            return this;
        }

        /**
         * Iteratively execute all stored methods, discarding return values
         */

    }, {
        key: "process",
        value: function process() {
            if (this.__proposition) {
                var _proposition;

                if ((_proposition = this.__proposition).test.apply(_proposition, arguments) === true) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.__methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var fn = _step.value;

                            if (typeof fn === "function") {
                                fn.apply(undefined, arguments);
                            } else if (fn instanceof Mutator) {
                                fn.process.apply(fn, arguments);
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

                    return true;
                }

                return false;
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.__methods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _fn = _step2.value;

                    if (typeof _fn === "function") {
                        _fn.apply(undefined, arguments);
                    } else if (_fn instanceof Mutator) {
                        _fn.process.apply(_fn, arguments);
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

            return true;
        }
        /**
         * Take @obj and reassign each subsequent reducer execution result, iteratively mutating @obj
         */

    }, {
        key: "mutate",
        value: function mutate() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (this.__proposition) {
                var _proposition2;

                if ((_proposition2 = this.__proposition).test.apply(_proposition2, args) === true) {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = this.__methods[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var fn = _step3.value;

                            if (typeof fn === "function") {
                                obj = fn.apply(undefined, [obj].concat(args));
                            } else if (fn instanceof Mutator) {
                                obj = fn.mutate.apply(fn, [obj].concat(args));
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
                }
            } else {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this.__methods[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _fn2 = _step4.value;

                        if (typeof _fn2 === "function") {
                            obj = _fn2.apply(undefined, [obj].concat(args));
                        } else if (_fn2 instanceof Mutator) {
                            obj = _fn2.mutate.apply(_fn2, [obj].concat(args));
                        }
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

            return obj;
        }

        //? .select|apply|change allow the <Mutator> to filter entries-as-kvp-objects
        //?     via @__proposition and change each remaining { key: value } by iterative
        //?     assignment via @this.__methods (obj[ key ] = ...fns(...))
        /**
         * A qualifier-filter function designed to test whether object values would activate the <Mutator>
         */

    }, {
        key: "qualify",
        value: function qualify() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var res = {};
            if (this.__proposition) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = Object.entries(obj)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _proposition3;

                        var _step5$value = _slicedToArray(_step5.value, 2),
                            key = _step5$value[0],
                            value = _step5$value[1];

                        if ((_proposition3 = this.__proposition).test.apply(_proposition3, [key, value].concat(args)) === true) {
                            res[key] = value;
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

            return res;
        }
    }, {
        key: "apply",
        value: function apply() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = Object.entries(obj)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _step6$value = _slicedToArray(_step6.value, 2),
                        key = _step6$value[0],
                        value = _step6$value[1];

                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = this.__methods[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var fn = _step7.value;

                            if (typeof fn === "function") {
                                obj[key] = fn.apply(undefined, [key, obj[key]].concat(args));
                            } else if (fn instanceof Mutator) {
                                obj[key] = fn.mutate.apply(fn, [obj[key], key, obj[key]].concat(args));
                            }
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
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

            return obj;
        }
    }, {
        key: "perform",
        value: function perform() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var qualifyArgs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var applyArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            var selected = this.qualify.apply(this, [obj].concat(_toConsumableArray(qualifyArgs)));

            return this.apply.apply(this, [selected].concat(_toConsumableArray(applyArgs)));
        }
    }]);

    return Mutator;
}();

exports.default = Mutator;