"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ModuleWebSocket = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Module2 = require("../core/ecs/Module");

var _Module3 = _interopRequireDefault(_Module2);

var _ComponentWebSocketClient = require("./ComponentWebSocketClient");

var _ComponentWebSocketClient2 = _interopRequireDefault(_ComponentWebSocketClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModuleWebSocket = exports.ModuleWebSocket = function (_Module) {
	_inherits(ModuleWebSocket, _Module);

	function ModuleWebSocket() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    entity = _ref.entity,
		    system = _ref.system,
		    _ref$args = _ref.args,
		    args = _ref$args === undefined ? [] : _ref$args,
		    _ref$tags = _ref.tags,
		    tags = _ref$tags === undefined ? [] : _ref$tags;

		_classCallCheck(this, ModuleWebSocket);

		var _this = _possibleConstructorReturn(this, (ModuleWebSocket.__proto__ || Object.getPrototypeOf(ModuleWebSocket)).call(this, "websocket", {
			entity: entity,
			system: system,
			componentClass: _ComponentWebSocketClient2.default,
			args: args,
			tags: tags
		}));

		console.log(_this);
		return _this;
	}

	_createClass(ModuleWebSocket, null, [{
		key: "Register",
		value: function Register(entity) {
			var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    system = _ref2.system,
			    _ref2$args = _ref2.args,
			    args = _ref2$args === undefined ? [] : _ref2$args,
			    _ref2$tags = _ref2.tags,
			    tags = _ref2$tags === undefined ? [] : _ref2$tags;

			return new this({ entity: entity, componentClass: _ComponentWebSocketClient2.default, system: system, args: args, tags: tags });
		}
	}]);

	return ModuleWebSocket;
}(_Module3.default);

;

exports.default = ModuleWebSocket;