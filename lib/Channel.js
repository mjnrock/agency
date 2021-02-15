"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _uuid = require("uuid");

var _Context = require("./Context");

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = function (_EventEmitter) {
    _inherits(Channel, _EventEmitter);

    function Channel(ctx) {
        _classCallCheck(this, Channel);

        var _this = _possibleConstructorReturn(this, (Channel.__proto__ || Object.getPrototypeOf(Channel)).call(this));

        _this._id = (0, _uuid.v4)();
        _this._subscription = null;

        _this.watch(ctx);
        return _this;
    }

    _createClass(Channel, [{
        key: "subscribe",
        value: function subscribe() {
            for (var _len = arguments.length, subscribers = Array(_len), _key = 0; _key < _len; _key++) {
                subscribers[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = subscribers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var subscriber = _step.value;

                    if (typeof subscriber === "function") {
                        this.on("broadcast", subscriber);
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

            return this._subscribers;
        }
    }, {
        key: "unsubscribe",
        value: function unsubscribe() {
            for (var _len2 = arguments.length, subscribers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                subscribers[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var subscriber = _step2.value;

                    if (typeof subscriber === "function") {
                        this.off("broadcast", subscriber);
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

            return this._subscribers;
        }
    }, {
        key: "watch",
        value: function watch(ctx) {
            var _this2 = this;

            var fn = function fn(state) {
                var _broadcast;

                for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    args[_key3 - 1] = arguments[_key3];
                }

                return (_broadcast = _this2.broadcast).call.apply(_broadcast, [_this2, ctx, state].concat(args));
            }; // @ctx is passed to identify which <Context> changed

            if (ctx instanceof _Context2.default) {
                ctx.on("update", fn);
                this._subscription = fn;
            } else {
                throw new Error("@subject must be a <Context>");
            }

            return this;
        }
    }, {
        key: "unwatch",
        value: function unwatch(ctx) {
            if (ctx instanceof _Context2.default) {
                ctx.off("update", this._subscription);
                this._subscription = null;
            } else {
                throw new Error("@subject must be a <Context>");
            }

            return this;
        }
    }, {
        key: "broadcast",
        value: function broadcast(ctx, state) {
            for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                args[_key4 - 2] = arguments[_key4];
            }

            this.emit("broadcast", [state].concat(args), ctx);
        }
    }]);

    return Channel;
}(_events2.default);

exports.default = Channel;
;