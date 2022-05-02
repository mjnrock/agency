"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Swarm = undefined;

var _Agent2 = require("./Agent");

var _Agent3 = _interopRequireDefault(_Agent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Swarm = exports.Swarm = function (_Agent) {
	_inherits(Swarm, _Agent);

	function Swarm() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    id = _ref.id;

		_classCallCheck(this, Swarm);

		return _possibleConstructorReturn(this, (Swarm.__proto__ || Object.getPrototypeOf(Swarm)).call(this, { id: id }));
	}

	return Swarm;
}(_Agent3.default);

;

exports.default = Swarm;