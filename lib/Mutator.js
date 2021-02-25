"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Mutator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

                            fn.apply(undefined, arguments);
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
                }

                return this;
            } else {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.__methods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _fn = _step2.value;

                        _fn.apply(undefined, arguments);
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

                return this;
            }
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

                            obj = fn.apply(undefined, [obj].concat(args));
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

                        obj = _fn2.apply(undefined, [obj].concat(args));
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
    }]);

    return Mutator;
}();

exports.default = Mutator;