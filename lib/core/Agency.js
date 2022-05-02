"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Agency = undefined;

var _Agent2 = require("./Agent");

var _Agent3 = _interopRequireDefault(_Agent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Agency = exports.Agency = function (_Agent) {
	_inherits(Agency, _Agent);

	function Agency() {
		var agents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		var agent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Agency);

		var _this = _possibleConstructorReturn(this, (Agency.__proto__ || Object.getPrototypeOf(Agency)).call(this, agent));

		_this.agents = agents;
		return _this;
	}

	return Agency;
}(_Agent3.default);

;

exports.default = Agency;