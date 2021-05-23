"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventWatchable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Watchable2 = require("./Watchable");

var _Watchable3 = _interopRequireDefault(_Watchable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is a conduit through which an <EventEmitter> can emit
 *  any event and the event data will be stored in state
 *  with the event name as the key.
 * 
 *  (e.g. event = "test" --> { test: { ... } })
 */
var EventWatchable = exports.EventWatchable = function (_Watchable) {
    _inherits(EventWatchable, _Watchable);

    /**
     * The primary purpose of this class is to act as a state of record
     *  for a given set of events, recording (or relaying) them as they happen.
     *  By default, it records *one (1)* previous emission.  This can be overriden
     *  by overwriting << __record >>.
     * 
     * @network The Agency <Network> to join
     * @eventEmitter <EventEmitter> or object of similar shape
     * @events [ ...eventNames ]
     * @state ? A default <Watchable> state
     * @useAsRelayOnly ? Forego saving event data and instead forward the event directly to the network
     * @namespace ? Only used if acting as a relay
     * @middleware ? fn -> T|F that can interrupt propagation if it returns false, a mutator, utility fn, etc.
     * @useExistingFnAsMiddleware ? If true, any function bound to `on${ eventName }` will be used as that event's @middleware
     */
    function EventWatchable(eventEmitter) {
        var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var _ret;

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var state = _ref.state,
            namespace = _ref.namespace,
            _ref$useAsRelayOnly = _ref.useAsRelayOnly,
            useAsRelayOnly = _ref$useAsRelayOnly === undefined ? false : _ref$useAsRelayOnly,
            _ref$middleware = _ref.middleware,
            middleware = _ref$middleware === undefined ? {} : _ref$middleware,
            _ref$useExistingFnAsM = _ref.useExistingFnAsMiddleware,
            useExistingFnAsMiddleware = _ref$useExistingFnAsM === undefined ? false : _ref$useExistingFnAsM,
            opts = _objectWithoutProperties(_ref, ["state", "namespace", "useAsRelayOnly", "middleware", "useExistingFnAsMiddleware"]);

        _classCallCheck(this, EventWatchable);

        var _this = _possibleConstructorReturn(this, (EventWatchable.__proto__ || Object.getPrototypeOf(EventWatchable)).call(this, state, opts));

        _this.__emitter = eventEmitter;
        _this.__handlers = {};
        _this.__middleware = middleware;

        _this.__config = {
            namespace: namespace,
            useAsRelayOnly: useAsRelayOnly,
            useExistingFnAsMiddleware: useExistingFnAsMiddleware
        };

        _this.add.apply(_this, _toConsumableArray(events));

        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(EventWatchable, [{
        key: "__record",
        value: function __record(type) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            this[type] = {
                previous: {
                    data: this[type].data,
                    dt: this[type].dt,
                    n: this[type].n
                },
                data: args,
                dt: Date.now(),
                n: (this[type].n || 0) + 1
            };
        }
    }, {
        key: "add",
        value: function add() {
            var _this2 = this;

            for (var _len2 = arguments.length, eventNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                eventNames[_key2] = arguments[_key2];
            }

            if (Array.isArray(eventNames[0])) {
                // "Single argument" assumption, overload
                eventNames = eventNames[0];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var eventName = _step.value;

                    _this2.__handlers[eventName] = function () {
                        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                            args[_key3] = arguments[_key3];
                        }

                        if (typeof _this2.__middleware[eventName] === "function") {
                            var _middleware;

                            var result = (_middleware = _this2.__middleware)[eventName].apply(_middleware, args);

                            if (result === false) {
                                return false;
                            }
                        }

                        if (_this2.__config.useAsRelayOnly) {
                            var _controller;

                            var type = _this2.__config.namespace ? _this2.__config.namespace + "." + eventName : eventName;

                            (_controller = _this2.__controller).dispatch.apply(_controller, [type].concat(args));
                        } else {
                            if (_this2[eventName] === void 0) {
                                _this2[eventName] = {};
                            }

                            _this2.__record.apply(_this2, [eventName].concat(args));
                        }

                        return true;
                    };

                    if (typeof _this2.__emitter.on === "function") {
                        _this2.__emitter.on(eventName, _this2.__handlers[eventName]);
                    } else if (typeof _this2.__emitter.addListener === "function") {
                        _this2.__emitter.addListener(eventName, _this2.__handlers[eventName]);
                    } else if (typeof _this2.__emitter.addEventListener === "function") {
                        _this2.__emitter.addEventListener(eventName, _this2.__handlers[eventName]);
                    } else if ("on" + eventName in _this2.__emitter) {
                        if (_this2.__config.useExistingFnAsMiddleware && typeof _this2.__emitter["on" + eventName] === "function") {
                            _this2.__middleware[eventName] = _this2.__emitter["on" + eventName];
                        }

                        _this2.__emitter["on" + eventName] = _this2.__handlers[eventName];
                    }
                };

                for (var _iterator = eventNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

            return this;
        }
    }, {
        key: "remove",
        value: function remove() {
            for (var _len4 = arguments.length, eventNames = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                eventNames[_key4] = arguments[_key4];
            }

            if (Array.isArray(eventNames[0])) {
                // "Single argument" assumption, overload
                eventNames = eventNames[0];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = eventNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _eventName = _step2.value;

                    if (typeof this.__emitter.off === "function") {
                        this.__emitter.off(_eventName, this.__handlers[_eventName]);
                    } else if (typeof this.__emitter.removeListener === "function") {
                        this.__emitter.removeListener(_eventName, this.__handlers[_eventName]);
                    } else if (typeof this.__emitter.removeEventListener === "function") {
                        this.__emitter.removeEventListener(_eventName, this.__handlers[_eventName]);
                    }

                    delete this[_eventName];
                    delete this.__middleware[_eventName];
                    delete this.__handlers[_eventName];
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
    }]);

    return EventWatchable;
}(_Watchable3.default);

exports.default = EventWatchable;