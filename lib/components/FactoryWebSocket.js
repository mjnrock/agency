"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FactoryWebSocket = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SystemWebSocket = require("./SystemWebSocket");

var _SystemWebSocket2 = _interopRequireDefault(_SystemWebSocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This is a use-example of abstracting Systems into something
 * higher level, like a dictionary.  However, this factory
 * is specifically tied to Web Sockets, so a generalized abstraction
 * is still required, but this is meant to provide some semblance
 * of a starting point.
 */
var FactoryWebSocket = exports.FactoryWebSocket = function () {
	function FactoryWebSocket() {
		var systemArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		_classCallCheck(this, FactoryWebSocket);

		if (!FactoryWebSocket.Instance) {
			FactoryWebSocket.Instance = this;
		} else {
			return FactoryWebSocket.Instance;
		}

		this.entries = new Map();
		this.entries.set("websocket", new (Function.prototype.bind.apply(_SystemWebSocket2.default, [null].concat(_toConsumableArray(systemArgs))))());
	}

	_createClass(FactoryWebSocket, null, [{
		key: "Register",
		value: function Register(entity) {
			var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var _ref$compArgs = _ref.compArgs,
			    compArgs = _ref$compArgs === undefined ? [] : _ref$compArgs,
			    _ref$tags = _ref.tags,
			    tags = _ref$tags === undefined ? [] : _ref$tags,
			    rest = _objectWithoutProperties(_ref, ["compArgs", "tags"]);

			var system = this.Instance.entries.get("websocket");

			return system.register(entity, _extends({ system: system, args: compArgs, tags: tags }, rest));
		}
	}]);

	return FactoryWebSocket;
}();

;

exports.default = FactoryWebSocket;