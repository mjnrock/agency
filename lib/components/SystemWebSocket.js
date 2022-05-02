"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SystemWebSocket = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _System2 = require("../core/ecs/System");

var _System3 = _interopRequireDefault(_System2);

var _ComponentWebSocketClient = require("./ComponentWebSocketClient");

var _ComponentWebSocketClient2 = _interopRequireDefault(_ComponentWebSocketClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SystemWebSocket = exports.SystemWebSocket = function (_System) {
	_inherits(SystemWebSocket, _System);

	function SystemWebSocket() {
		var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    state = _ref.state,
		    _ref$Agent = _ref.Agent,
		    Agent = _ref$Agent === undefined ? {} : _ref$Agent;

		_classCallCheck(this, SystemWebSocket);

		return _possibleConstructorReturn(this, (SystemWebSocket.__proto__ || Object.getPrototypeOf(SystemWebSocket)).call(this, "websocket", events, { state: state, Agent: Agent }));
	}

	_createClass(SystemWebSocket, [{
		key: "register",
		value: function register(entity) {
			var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var _ref2$args = _ref2.args,
			    args = _ref2$args === undefined ? [] : _ref2$args,
			    _ref2$tags = _ref2.tags,
			    tags = _ref2$tags === undefined ? [] : _ref2$tags,
			    rest = _objectWithoutProperties(_ref2, ["args", "tags"]);

			return _get(SystemWebSocket.prototype.__proto__ || Object.getPrototypeOf(SystemWebSocket.prototype), "register", this).call(this, entity, _ComponentWebSocketClient2.default, _extends({ args: args, tags: tags }, rest));
		}
	}]);

	return SystemWebSocket;
}(_System3.default);

SystemWebSocket.EnumTriggers = ["close", "error", "message", "message_error", "open", "ping", "pong", "unexpected_response", "upgrade"];
;

exports.default = SystemWebSocket;