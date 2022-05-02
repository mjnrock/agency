"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SysWebSocket = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _System2 = require("../core/ecs/System");

var _System3 = _interopRequireDefault(_System2);

var _WebSocketClient = require("./WebSocketClient");

var _WebSocketClient2 = _interopRequireDefault(_WebSocketClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SysWebSocket = exports.SysWebSocket = function (_System) {
	_inherits(SysWebSocket, _System);

	function SysWebSocket() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var opts = _objectWithoutProperties(_ref, []);

		_classCallCheck(this, SysWebSocket);

		var _this = _possibleConstructorReturn(this, (SysWebSocket.__proto__ || Object.getPrototypeOf(SysWebSocket)).call(this, _extends({}, opts)));

		_this.qualifier = function (node) {
			if ([].concat(_toConsumableArray(node.components.values())).some(function (comp) {
				return _WebSocketClient2.default.Has(comp);
			})) {
				return true;
			}

			return false;
		};

		_this.addTrigger("event", function (trigger, component) {
			for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				args[_key - 2] = arguments[_key];
			}

			if (trigger === "message") {
				var msg = void 0;
				if (typeof component.middleware.unpack === "function") {
					var data = component.middleware.unpack(args);

					msg = Signal.Create({ emitter: component, type: trigger, data: data });
				} else {
					msg = Signal.Create({ emitter: component, type: trigger, data: args });
				}

				_this.invoke(msg);
			} else {
				_this.invoke.apply(_this, [trigger].concat(args));
			}
		});
		return _this;
	}

	_createClass(SysWebSocket, [{
		key: "bind",
		value: function bind(comp) {
			var _this2 = this;

			var resetListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (resetListeners) {
				comp.connection.removeAllListeners();
			}

			var listeners = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				var _loop = function _loop() {
					var _comp$connection;

					var trigger = _step.value;

					var listener = [trigger, function () {
						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						return _this2.invoke.apply(_this2, ["event", trigger, component].concat(args));
					}];

					(_comp$connection = comp.connection).addEventListener.apply(_comp$connection, listener);
					listener.push(listener);
				};

				for (var _iterator = EnumTriggers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

			return listeners;
		}
	}, {
		key: "unbind",
		value: function unbind(comp, listeners) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _comp$connection2;

					var listener = _step2.value;

					(_comp$connection2 = comp.connection).removeEventListener.apply(_comp$connection2, _toConsumableArray(listener));
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

			return comp;
		}
	}, {
		key: "connect",
		value: function connect(comp) {
			var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    url = _ref2.url,
			    host = _ref2.host,
			    _ref2$protocol = _ref2.protocol,
			    protocol = _ref2$protocol === undefined ? "http" : _ref2$protocol,
			    port = _ref2.port,
			    ws = _ref2.ws,
			    resetListeners = _ref2.resetListeners;

			if (ws instanceof WebSocket) {
				comp.connection = ws;
			} else if (host && protocol && port) {
				comp.connection = new WebSocket(protocol + "://" + host + ":" + port);
			} else {
				comp.connection = new WebSocket(url);
			}

			this.bind(comp, resetListeners);

			return comp;
		}
	}, {
		key: "send",
		value: function send(comp, signal) {
			if (comp.isConnected()) {
				//TODO Transform payload into a Signal
				comp.connection.send(signal);

				return true;
			}

			return false;
		}
	}, {
		key: "disconnect",
		value: function disconnect(comp, code, reason) {
			var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			comp.connection.close(code, reason);

			if (typeof timeout === "number" && timeout > 0) {
				setTimeout(function () {
					try {
						if (!comp.isClosed()) {
							comp.kill();
						}
					} catch (e) {
						comp.invoke("error", e);
					}
				}, timeout);
			}
		}
	}, {
		key: "kill",
		value: function kill(comp) {
			comp.connection.terminate();
		}
	}]);

	return SysWebSocket;
}(_System3.default);

SysWebSocket.EnumTriggers = ["close", "error", "message", "message_error", "open", "ping", "pong", "unexpected_response", "upgrade"];
;

_WebSocketClient2.default.System = SysWebSocket;

exports.default = SysWebSocket;