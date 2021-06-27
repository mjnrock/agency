"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AgencyMap = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emitter2 = require("./event/Emitter");

var _Emitter3 = _interopRequireDefault(_Emitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AgencyMap = exports.AgencyMap = function (_Emitter) {
	_inherits(AgencyMap, _Emitter);

	function AgencyMap() {
		var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		_classCallCheck(this, AgencyMap);

		var _this = _possibleConstructorReturn(this, (AgencyMap.__proto__ || Object.getPrototypeOf(AgencyMap)).call(this));

		if (Array.isArray(entries)) {
			_this.__map = new Map(entries);
		} else if ((typeof entries === "undefined" ? "undefined" : _typeof(entries)) === "object") {
			_this.__map = new Map(Object.entries(entries));
		}
		return _this;
	}

	_createClass(AgencyMap, [{
		key: "reseed",
		value: function reseed(entries) {
			if (Array.isArray(entries)) {
				this.__map = new Map(entries);
			} else if ((typeof entries === "undefined" ? "undefined" : _typeof(entries)) === "object") {
				this.__map = new Map(Object.entries(entries));
			}

			this.emit(AgencyMap.Signal.RESEED);

			return this;
		}
	}, {
		key: "clear",
		value: function clear() {
			this.__map.clear();
			this.emit(AgencyMap.Signal.CLEAR);

			return this;
		}
	}, {
		key: "get",
		value: function get(key) {
			return this.__map.get(key);
		}
	}, {
		key: "delete",
		value: function _delete(input) {
			var result = this.__map.delete(input);

			if (result) {
				this.emit(AgencyMap.Signal.DELETE, input);
			}

			return result;
		}
	}, {
		key: "set",
		value: function set(key, value) {
			this.__map.set(key, value);

			this.emit(AgencyMap.Signal.SET, key, value);

			return this;
		}

		//NOTE:	These do NOT return a <Map Iterator>, but instead return an <Array>

	}, {
		key: "keys",
		value: function keys() {
			return [].concat(_toConsumableArray(this.__map.keys()));
		}
	}, {
		key: "values",
		value: function values() {
			return [].concat(_toConsumableArray(this.__map.values()));
		}
	}, {
		key: "entries",
		value: function entries() {
			var asObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (asObject) {
				return Object.fromEntries(this.__map.entries());
			}

			return [].concat(_toConsumableArray(this.__map.entries()));
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
				return Object.fromEntries(result);
			}

			if (save) {
				return this.reseed(result);
			}

			return result;
		}
	}, {
		key: "size",
		get: function get() {
			return this.__map.size;
		}
	}, {
		key: "has",
		get: function get() {
			return this.__map.has;
		}
	}]);

	return AgencyMap;
}(_Emitter3.default);

AgencyMap.Signal = {
	CLEAR: "Map.Clear",
	DELETE: "Map.Delete",
	RESEED: "Map.Reseed",
	SET: "Map.Set"
};
;

exports.default = AgencyMap;