"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Field = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emitter2 = require("./../event/Emitter");

var _Emitter3 = _interopRequireDefault(_Emitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = exports.Field = function (_Emitter) {
	_inherits(Field, _Emitter);

	function Field() {
		var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref$nodes = _ref.nodes,
		    nodes = _ref$nodes === undefined ? [] : _ref$nodes,
		    _ref$entities = _ref.entities,
		    entities = _ref$entities === undefined ? [] : _ref$entities;

		_classCallCheck(this, Field);

		var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, {}));

		_this.size = [].concat(_toConsumableArray(size), [0, 0, 0]).slice(0, 3);

		_this.nodes = nodes;
		_this.entities = entities;
		return _this;
	}

	_createClass(Field, [{
		key: "x",
		get: function get() {
			return this.size[0];
		},
		set: function set(x) {
			this.size[0] = x;
		}
	}, {
		key: "y",
		get: function get() {
			return this.size[1];
		},
		set: function set(y) {
			this.size[1] = y;
		}
	}, {
		key: "z",
		get: function get() {
			return this.size[2];
		},
		set: function set(z) {
			this.size[2] = z;
		}
	}, {
		key: "sizeObj",
		get: function get() {
			return {
				x: this.x,
				y: this.y,
				z: this.z
			};
		}
	}]);

	return Field;
}(_Emitter3.default);

;

exports.default = Field;