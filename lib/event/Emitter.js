"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Emitter = exports.$Emitter = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase = require("../AgencyBase");

var _AgencyBase2 = _interopRequireDefault(_AgencyBase);

var _helper = require("../util/helper");

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $Emitter = function $Emitter($super) {
	return function (_$super) {
		_inherits(_class, _$super);

		function _class() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var _ref$Emitter = _ref.Emitter,
			    Emitter = _ref$Emitter === undefined ? {} : _ref$Emitter,
			    rest = _objectWithoutProperties(_ref, ["Emitter"]);

			_classCallCheck(this, _class);

			var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));

			_this.__channel = new _Channel2.default({ handlers: _extends({}, Emitter.hooks || {}) });
			return _this;
		}

		_createClass(_class, [{
			key: "$hook",
			value: function $hook() {
				var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				this.__channel.parseHandlerObject(handlers);

				return this;
			}
		}, {
			key: "$emit",
			value: function $emit(type) {
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				this.__channel.bus(new (Function.prototype.bind.apply(_Message2.default, [null].concat([this, type], args)))());
			}
		}]);

		return _class;
	}($super);
};

exports.$Emitter = $Emitter;

var Emitter = exports.Emitter = function (_compose) {
	_inherits(Emitter, _compose);

	function Emitter() {
		var hooks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Emitter);

		return _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this, {
			Emitter: {
				hooks: hooks
			}
		}));
	}

	_createClass(Emitter, [{
		key: "hook",
		get: function get() {
			return this.$hook.bind(this);
		}
	}, {
		key: "emit",
		get: function get() {
			return this.$emit.bind(this);
		}
	}]);

	return Emitter;
}((0, _helper.compose)($Emitter)(_AgencyBase2.default));

exports.default = Emitter;