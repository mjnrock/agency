"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _Context = require("./Context");

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//? <Observer> watches a <Context> and iteratively executes each @effect when <Context> emits "update"
var Observer = function () {
    function Observer(ctx) {
        _classCallCheck(this, Observer);

        this._id = (0, _uuid.v4)();

        for (var _len = arguments.length, effects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            effects[_key - 1] = arguments[_key];
        }

        this._effects = new Set(effects);

        this.watch(ctx);
    }

    /**
     * Add an effect function to the <Context>
     */


    _createClass(Observer, [{
        key: "add",
        value: function add() {
            for (var _len2 = arguments.length, effects = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                effects[_key2] = arguments[_key2];
            }

            this._effects = new Set([].concat(_toConsumableArray(this._effects), effects));

            return this._effects;
        }
        /**
         * Remove an effect function to the <Context>
         */

    }, {
        key: "remove",
        value: function remove() {
            for (var _len3 = arguments.length, effects = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                effects[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = effects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var effect = _step.value;

                    this._effects.delete(effect);
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

            return this._effects;
        }
    }, {
        key: "watch",
        value: function watch(ctx) {
            var _this = this;

            var fn = function fn() {
                var _run;

                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                return (_run = _this.run).call.apply(_run, [_this, ctx].concat(args));
            };

            if (ctx instanceof _Context2.default) {
                ctx.on("update", fn);
                this.__subscription = fn;
            } else {
                throw new Error("@subject must be a <Context>");
            }

            return this;
        }
    }, {
        key: "unwatch",
        value: function unwatch(ctx) {
            if (ctx instanceof _Context2.default) {
                ctx.off("update", this.__subscription);
                delete this.__subscription;
            } else {
                throw new Error("@subject must be a <Context>");
            }

            return this;
        }
    }, {
        key: "run",
        value: function run(ctx) {
            var _this2 = this;

            for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
            }

            return new Promise(function (resolve, reject) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = _this2._effects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var effect = _step2.value;

                        if (typeof effect === "function") {
                            effect.call.apply(effect, [ctx].concat(args));
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

                resolve.apply(undefined, [ctx].concat(args));
            });
        }
    }]);

    return Observer;
}();

exports.default = Observer;
;