"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Network = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emitter2 = require("./Emitter");

var _Emitter3 = _interopRequireDefault(_Emitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Due to the provenance chain present in a message, the <Emitter>
 *      family should be largely immune to feedback loops, as a
 *      recycled message should be ignored by the <Emitter> on any
 *      subsequent passes.
 */
var Network = exports.Network = function (_Emitter) {
    _inherits(Network, _Emitter);

    function Network() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref$handlers = _ref.handlers,
            handlers = _ref$handlers === undefined ? {} : _ref$handlers,
            _ref$pairBinding = _ref.pairBinding,
            pairBinding = _ref$pairBinding === undefined ? false : _ref$pairBinding,
            opts = _objectWithoutProperties(_ref, ["handlers", "pairBinding"]);

        _classCallCheck(this, Network);

        var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, handlers, opts));

        _this.__pairBinding = pairBinding;
        return _this;
    }

    _createClass(Network, [{
        key: "join",
        value: function join() {
            for (var _len = arguments.length, emitters = Array(_len), _key = 0; _key < _len; _key++) {
                emitters[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = emitters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var emitter = _step.value;

                    if (emitter instanceof _Emitter3.default) {
                        emitter.addSubscriber(this);

                        if (this.__pairBinding) {
                            this.addSubscriber(emitter);
                        }

                        this.$.emit("join", emitter);
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

            return this;
        }
    }, {
        key: "leave",
        value: function leave() {
            for (var _len2 = arguments.length, emitters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                emitters[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = emitters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var emitter = _step2.value;

                    if (emitter instanceof _Emitter3.default) {
                        emitter.removeSubscriber(this);

                        if (this.__pairBinding) {
                            this.removeSubscriber(emitter);
                        }

                        this.$.emit("leave", emitter);
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

            return this;
        }
    }, {
        key: "fire",
        value: async function fire(event) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.__subscribers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var emitter = _step3.value;

                    if (typeof emitter === "function") {
                        emitter.apply(undefined, [event].concat(args));
                    } else if (emitter instanceof _Emitter3.default) {
                        var _emitter$$;

                        (_emitter$$ = emitter.$).emit.apply(_emitter$$, [event].concat(args));
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

            return true;
        }
    }]);

    return Network;
}(_Emitter3.default);

Network.Events = ["join", "leave"];
;

exports.default = Network;