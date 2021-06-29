"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Config = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Section2 = require("./Section");

var _Section3 = _interopRequireDefault(_Section2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Config = exports.Config = function (_Section) {
	_inherits(Config, _Section);

	function Config(data) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var _ref$children = _ref.children,
		    children = _ref$children === undefined ? [] : _ref$children,
		    opts = _objectWithoutProperties(_ref, ["children"]);

		_classCallCheck(this, Config);

		return _possibleConstructorReturn(this, (Config.__proto__ || Object.getPrototypeOf(Config)).call(this, data, _extends({
			children: children,
			type: Config.Type
		}, opts)));
	}

	_createClass(Config, null, [{
		key: "Conforms",
		value: function Conforms(obj) {
			return "type" in obj && obj.type === Config.Type && "data" in obj && "meta" in obj && "children" in obj;
		}
	}, {
		key: "FromObject",
		value: function FromObject(obj) {
			if (this.Conforms(obj)) {
				var children = obj.children.map(function (child) {
					if (_Section3.default.Conforms(child)) {
						return _Section3.default.FromObject(child);
					} else if (Entry.Conforms(child)) {
						return Entry.FromObject(child);
					}
				});

				return new _Section3.default(obj.data, {
					type: obj.type,
					meta: obj.meta,
					children: children
				});
			}

			return false;
		}
	}]);

	return Config;
}(_Section3.default);

Config.Type = "config";
;

exports.default = Config;