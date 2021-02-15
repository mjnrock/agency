"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mutator = function () {
    function Mutator() {
        _classCallCheck(this, Mutator);

        this._id = (0, _uuid.v4)();

        for (var _len = arguments.length, sequence = Array(_len), _key = 0; _key < _len; _key++) {
            sequence[_key] = arguments[_key];
        }

        this._sequence = sequence;
    }

    _createClass(Mutator, [{
        key: "add",
        value: function add(sorter) {
            for (var _len2 = arguments.length, fns = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                fns[_key2 - 1] = arguments[_key2];
            }

            if (!fns.every(function (fn) {
                return typeof fn === "function";
            })) {
                throw new Error("All @fns must be of type |function|");
            }

            this._evaluators = sorter([].concat(_toConsumableArray(this._evaluators), fns));

            return this;
        }
    }, {
        key: "remove",
        value: function remove(sorter) {
            var _this = this;

            for (var _len3 = arguments.length, fns = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                fns[_key3 - 1] = arguments[_key3];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var fn = _step.value;

                    if (typeof fn !== "function") {
                        throw new Error("All @fns must be of type |function|");
                    }

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

            this._evaluators = sorter(this._evaluators);

            return this;
        }
    }, {
        key: "mutate",
        value: function mutate() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._sequence[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _fn = _step2.value;

                    state = _fn.apply(undefined, [state].concat(args));
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

            return state;
        }
    }]);

    return Mutator;
}();

exports.default = Mutator;
;