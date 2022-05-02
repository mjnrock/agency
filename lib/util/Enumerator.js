"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.Enumerator = Enumerator;

var _Bitwise = require("./Bitwise");

var _Bitwise2 = _interopRequireDefault(_Bitwise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * This adds "lookup" functions to an enumeration object
 */
function Enumerator() {
	var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$asBitwise = _ref.asBitwise,
	    asBitwise = _ref$asBitwise === undefined ? false : _ref$asBitwise;

	var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	    _ref2$startAt = _ref2.startAt,
	    startAt = _ref2$startAt === undefined ? 0 : _ref2$startAt,
	    _ref2$step = _ref2.step,
	    step = _ref2$step === undefined ? 1 : _ref2$step,
	    assigner = _ref2.assigner;

	var obj = {};

	if (Array.isArray(items)) {
		if (asBitwise === true) {
			for (var i = 0; i < Math.min(items.length, 32); i++) {
				obj[items[i]] = 1 << i;
			}
		} else {
			for (var _i = 0; _i < items.length; _i++) {
				if (typeof assigner === "function") {
					obj[items[_i]] = assigner(_i, items[_i], { items: items, enum: obj });
				} else {
					obj[items[_i]] = step * _i + startAt;
				}
			}
		}
	} else {
		obj = _extends({}, items);
	}

	if (asBitwise === true) {

		obj.flagToName = function (flag) {
			for (var name in obj) {
				if (obj[name] === flag) {
					return name;
				}
			}

			return null;
		};
		obj.maskToNames = function (mask) {
			var names = [];

			for (var name in obj) {
				if (_Bitwise2.default.has(mask, obj[name])) {
					names.push(name);
				}
			}

			return names;
		};

		obj[Symbol.iterator] = function () {
			var index = -1;
			var data = Object.entries(obj).reduce(function (p, _ref3) {
				var _ref4 = _slicedToArray(_ref3, 2),
				    k = _ref4[0],
				    v = _ref4[1];

				if (k !== "flagToName" && k !== "maskToNames") {
					return [].concat(_toConsumableArray(p), [[k, v]]);
				}

				return p;
			}, []);

			return {
				next: function next() {
					return { value: data[++index], done: !(index in data) };
				}
			};
		};
	} else {
		obj[Symbol.iterator] = function () {
			var index = -1;
			var data = Object.entries(obj);

			return {
				next: function next() {
					return { value: data[++index], done: !(index in data) };
				}
			};
		};
	}

	return Object.freeze(obj);
};

exports.default = Enumerator;