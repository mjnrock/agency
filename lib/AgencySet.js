"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AgencySet = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emitter2 = require("./event/Emitter");

var _Emitter3 = _interopRequireDefault(_Emitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AgencySet = exports.AgencySet = function (_Emitter) {
	_inherits(AgencySet, _Emitter);

	function AgencySet() {
		var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		_classCallCheck(this, AgencySet);

		var _this = _possibleConstructorReturn(this, (AgencySet.__proto__ || Object.getPrototypeOf(AgencySet)).call(this));

		_this.__set = new Set(values);
		return _this;
	}

	_createClass(AgencySet, [{
		key: "reseed",
		value: function reseed(values) {
			this.__set = new Set(values);
			this.emit(AgencySet.Signal.RESEED);

			return this;
		}
	}, {
		key: "clear",
		value: function clear() {
			this.__set.clear();
			this.emit(AgencySet.Signal.CLEAR);

			return this;
		}
	}, {
		key: "get",
		value: function get(index) {
			return [].concat(_toConsumableArray(this.__set))[index];
		}
	}, {
		key: "delete",
		value: function _delete(input) {
			var result = this.__set.delete(input);

			if (result) {
				this.emit(AgencySet.Signal.DELETE, input);
			}

			return result;
		}
	}, {
		key: "add",
		value: function add(input) {
			this.__set.add(input);

			this.emit(AgencySet.Signal.ADD, input);

			return this;
		}

		//NOTE:	These do NOT return a <Set Iterator>, but instead return an <Array>

	}, {
		key: "keys",
		value: function keys() {
			return [].concat(_toConsumableArray(this.__set)).map(function (v, i) {
				return i;
			});
		}
	}, {
		key: "values",
		value: function values() {
			return [].concat(_toConsumableArray(this.__set));
		}
	}, {
		key: "entries",
		value: function entries() {
			var asObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (asObject) {
				return _extends({}, [].concat(_toConsumableArray(this.__set)));
			}

			return [].concat(_toConsumableArray(this.__set)).map(function (v, i) {
				return [i, v];
			});
		}
	}, {
		key: "map",
		value: function map(fn) {
			var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    _ref$save = _ref.save,
			    save = _ref$save === undefined ? false : _ref$save,
			    _ref$asObject = _ref.asObject,
			    asObject = _ref$asObject === undefined ? false : _ref$asObject;

			if (save && asObject) {
				throw new Error("XOR check [FAILED] on passed options.");
			}

			var entries = this.entries();
			var result = [];

			var i = 0;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _slicedToArray(_step.value, 2),
					    key = _step$value[0],
					    value = _step$value[1];

					result.push(fn(key, value, i, this));

					++i;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			if (asObject) {
				return Object.fromEntries(result.map(function (v, i) {
					return [i, v];
				}));
			}

			if (save) {
				return this.reseed(result);
			}

			return result;
		}
	}, {
		key: "size",
		get: function get() {
			return this.__set.size;
		}
	}, {
		key: "has",
		get: function get() {
			return this.__set.has;
		}
	}]);

	return AgencySet;
}(_Emitter3.default);

AgencySet.Signal = {
	CLEAR: "Set.Clear",
	DELETE: "Set.Delete",
	RESEED: "Set.Reseed",
	ADD: "Set.Add"
};
;

exports.default = AgencySet;