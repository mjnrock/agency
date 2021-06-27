"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Space = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network2 = require("./../event/Network");

var _Network3 = _interopRequireDefault(_Network2);

var _AgencySet = require("../AgencySet");

var _AgencySet2 = _interopRequireDefault(_AgencySet);

var _AgencyMap = require("../AgencyMap");

var _AgencyMap2 = _interopRequireDefault(_AgencyMap);

var _Field = require("./Field");

var _Field2 = _interopRequireDefault(_Field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Space = exports.Space = function (_Network) {
	_inherits(Space, _Network);

	function Space() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$fields = _ref.fields,
		    fields = _ref$fields === undefined ? [] : _ref$fields,
		    _ref$modify = _ref.modify,
		    modify = _ref$modify === undefined ? {} : _ref$modify;

		_classCallCheck(this, Space);

		return _possibleConstructorReturn(this, (Space.__proto__ || Object.getPrototypeOf(Space)).call(this, {
			fields: new _AgencySet2.default(fields)
		}, _extends({
			default: _defineProperty({}, _Network3.default.Signal.UPDATE, function (msg) {
				return console.log(msg);
			})
		}, modify)));

		// this.state.fields.hook({
		// 	"*": msg => console.log("SET", msg)
		// })
	}

	_createClass(Space, [{
		key: "addField",
		value: function addField(field) {
			if (field instanceof _Field2.default) {
				this.state.fields.add(field);
			}
		}
	}]);

	return Space;
}(_Network3.default);

;

exports.default = Space;