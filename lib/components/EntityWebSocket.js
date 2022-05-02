"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EntityWebSocket = undefined;

var _Entity2 = require("../core/ecs/Entity");

var _Entity3 = _interopRequireDefault(_Entity2);

var _FactoryWebSocket = require("./FactoryWebSocket");

var _FactoryWebSocket2 = _interopRequireDefault(_FactoryWebSocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EntityWebSocket = exports.EntityWebSocket = function (_Entity) {
	_inherits(EntityWebSocket, _Entity);

	function EntityWebSocket() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$WebSocket = _ref.WebSocket,
		    WebSocket = _ref$WebSocket === undefined ? {} : _ref$WebSocket;

		_classCallCheck(this, EntityWebSocket);

		var _this = _possibleConstructorReturn(this, (EntityWebSocket.__proto__ || Object.getPrototypeOf(EntityWebSocket)).call(this));

		_FactoryWebSocket2.default.Register(_this, {
			compArgs: WebSocket.args || [],
			tags: WebSocket.tags || []
		});
		return _this;
	}

	return EntityWebSocket;
}(_Entity3.default);

;

exports.default = EntityWebSocket;