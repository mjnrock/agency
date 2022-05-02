"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WeightedPool = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dice = require("./Dice.js");

var _Dice2 = _interopRequireDefault(_Dice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WeightedPool = function () {
    //#base @weights = [...<int>], @values = [...<any>]
    //#overload1 @weights = [...[<int>,<any>]]
    function WeightedPool(weights, values) {
        _classCallCheck(this, WeightedPool);

        this.reweigh(weights, values);
    }

    _createClass(WeightedPool, [{
        key: "roll",
        value: function roll() {
            return _Dice2.default.weighted(this.weights, this.values);
        }

        /**
         * @scalar = 1000 allows #.### precision
         */

    }, {
        key: "chance",
        value: function chance(index) {
            var scalar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

            var sum = this.weights.reduce(function (a, v) {
                return a + v;
            }, 0);

            return Math.round(this.weights[index] / sum * scalar) / scalar;
        }

        /**
         * Smart getter/setter
         */

    }, {
        key: "weight",
        value: function weight(index, value) {
            if (value === void 0) {
                return this.weights[index];
            }

            if (typeof value === "number") {
                this.weights[index] = value;
            }

            return this;
        }
        /**
         * Smart getter/setter
         */

    }, {
        key: "value",
        value: function value(index, _value) {
            if (_value === void 0) {
                return this.values[index];
            }

            this.values[index] = _value;

            return this;
        }
    }, {
        key: "reweigh",
        value: function reweigh(weights, values) {
            if (Array.isArray(weights[0]) && weights[0].length === 2) {
                //  ([ [ weight, value ], ... ])
                this.weights = [];
                this.values = [];

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = weights[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _step$value = _slicedToArray(_step.value, 2),
                            weight = _step$value[0],
                            value = _step$value[1];

                        this.weights.push(weight);
                        this.values.push(value);
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
                // ([ weight, ... ], [ value, ... ])
                this.weights = weights;
                this.values = values;
            }
        }
    }]);

    return WeightedPool;
}();

exports.WeightedPool = WeightedPool;
exports.default = WeightedPool;