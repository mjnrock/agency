"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ComponentWebSocketClient = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../core/ecs/Component");

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComponentWebSocketClient = exports.ComponentWebSocketClient = function (_Component) {
	_inherits(ComponentWebSocketClient, _Component);

	function ComponentWebSocketClient() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    connection = _ref.connection,
		    _ref$middleware = _ref.middleware,
		    middleware = _ref$middleware === undefined ? {} : _ref$middleware;

		_classCallCheck(this, ComponentWebSocketClient);

		var _this = _possibleConstructorReturn(this, (ComponentWebSocketClient.__proto__ || Object.getPrototypeOf(ComponentWebSocketClient)).call(this));

		_this.connection = connection;
		_this.middleware = _extends({
			pack: null,
			unpack: null
		}, middleware);
		return _this;
	}

	_createClass(ComponentWebSocketClient, [{
		key: "useNodeBuffer",
		value: function useNodeBuffer() {
			this.connection.binaryType = "nodebuffer";
		}
	}, {
		key: "useArrayBuffer",
		value: function useArrayBuffer() {
			this.connection.binaryType = "arraybuffer";
		}
	}, {
		key: "useFragments",
		value: function useFragments() {
			this.connection.binaryType = "fragments";
		}
	}, {
		key: "isConnecting",
		value: function isConnecting() {
			return this.connection.readyState === 0;
		}
	}, {
		key: "isConnected",
		value: function isConnected() {
			return this.connection.readyState === 1;
		}
	}, {
		key: "isClosing",
		value: function isClosing() {
			return this.connection.readyState === 2;
		}
	}, {
		key: "isClosed",
		value: function isClosed() {
			return this.connection.readyState === 3;
		}
	}], [{
		key: "Create",
		value: function Create() {
			var fnOrObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var args = void 0;
			if (typeof fnOrObj === "function") {
				args = fnOrObj();
			} else {
				args = fnOrObj;
			}

			return new this(args);
		}
	}]);

	return ComponentWebSocketClient;
}(_Component3.default);

;

exports.default = ComponentWebSocketClient;