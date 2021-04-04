"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventBus = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Registry2 = require("../Registry");

var _Registry3 = _interopRequireDefault(_Registry2);

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _Router = require("./Router");

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventBus = exports.EventBus = function (_Registry) {
    _inherits(EventBus, _Registry);

    function EventBus() {
        _classCallCheck(this, EventBus);

        var _this = _possibleConstructorReturn(this, (EventBus.__proto__ || Object.getPrototypeOf(EventBus)).call(this));

        _this.router = new _Router2.default();
        return _this;
    }

    _createClass(EventBus, [{
        key: "matchFirst",
        value: function matchFirst() {
            this.router.type = _Router2.default.EnumRouteType.MatchFirst;

            return this;
        }
    }, {
        key: "matchAll",
        value: function matchAll() {
            this.router.type = _Router2.default.EnumRouteType.MatchAll;

            return this;
        }
    }, {
        key: "joinChannel",
        value: function joinChannel(nameOrChannel, emitter) {
            var channel = this[nameOrChannel];

            if (channel instanceof _Channel2.default) {
                for (var _len = arguments.length, synonyms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    synonyms[_key - 2] = arguments[_key];
                }

                return channel.join.apply(channel, [emitter].concat(synonyms));
            }
        }
    }, {
        key: "leaveChannel",
        value: function leaveChannel(nameOrChannel, emitterSynOrId) {
            var channel = this[nameOrChannel];

            if (channel instanceof _Channel2.default) {
                return channel.leave.apply(channel, [emitterSynOrId].concat(_toConsumableArray(synonyms)));
            }
        }
    }, {
        key: "createChannel",
        value: function createChannel(name) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            var channel = new (Function.prototype.bind.apply(_Channel2.default, [null].concat(args)))();

            this.register(channel, name);

            return channel;
        }
    }, {
        key: "createChannels",
        value: function createChannels() {
            var createChannelArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var channels = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = createChannelArgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _toArray(_step.value),
                        name = _step$value[0],
                        _args = _step$value.slice(1);

                    channels.push(this.createChannel.apply(this, [name].concat(_toConsumableArray(_args))));
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

            return channels;
        }
    }, {
        key: "destroyChannel",
        value: function destroyChannel(nameOrChannel) {
            return this.unregister(nameOrChannel);
        }
    }, {
        key: "destroyChannels",
        value: function destroyChannels() {
            var destroyChannelArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var results = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = destroyChannelArgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _toArray(_step2.value),
                        name = _step2$value[0],
                        _args2 = _step2$value.slice(1);

                    results.push(this.destroyChannel.apply(this, [name].concat(_toConsumableArray(_args2))));
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

            return results;
        }
    }, {
        key: "process",
        value: function process() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var channel = _step3.value;

                    channel.process();
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
    }], [{
        key: "Reassign",
        value: function Reassign() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            EventBus.Instance = new (Function.prototype.bind.apply(EventBus, [null].concat(args)))();
        }
    }, {
        key: "Route",
        value: function Route() {
            var _EventBus$$$router;

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            (_EventBus$$$router = EventBus.$.router).route.apply(_EventBus$$$router, [this].concat(args)); // @this should resolve to the payload here, based on <Emitter> behavior
        }
    }, {
        key: "$",
        get: function get() {
            if (!EventBus.Instance) {
                EventBus.Instance = new EventBus();
            }

            return EventBus.Instance;
        }
    }]);

    return EventBus;
}(_Registry3.default);

EventBus.Instance = new EventBus();

EventBus.Middleware = function (emitter) {
    return emitter.addSubscriber(EventBus.Route);
};

;

exports.default = EventBus;