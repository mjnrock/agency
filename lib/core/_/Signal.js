"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Signal = exports.frozenKeys = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Agent2 = require("./Agent");

var _Agent3 = _interopRequireDefault(_Agent2);

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frozenKeys = exports.frozenKeys = ["id", "type", "data", "emitter", "destination", "timestamp", "id", "tags", "meta", "isClone"];

var Signal = exports.Signal = function (_Agent) {
	_inherits(Signal, _Agent);

	function Signal() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    type = _ref.type,
		    data = _ref.data,
		    emitter = _ref.emitter,
		    destination = _ref.destination,
		    _ref$tags = _ref.tags,
		    tags = _ref$tags === undefined ? [] : _ref$tags,
		    _ref$meta = _ref.meta,
		    meta = _ref$meta === undefined ? {} : _ref$meta,
		    parent = _ref.parent;

		var _ret;

		var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref2$override = _ref2.override,
		    override = _ref2$override === undefined ? false : _ref2$override,
		    _ref2$coerced = _ref2.coerced,
		    coerced = _ref2$coerced === undefined ? false : _ref2$coerced,
		    timestamp = _ref2.timestamp,
		    id = _ref2.id;

		_classCallCheck(this, Signal);

		var _this = _possibleConstructorReturn(this, (Signal.__proto__ || Object.getPrototypeOf(Signal)).call(this, { id: id, tags: tags, parent: parent }));

		_this.type = type;
		_this.data = data;

		if (emitter instanceof _Node2.default) {
			_this.emitter = emitter.id;
		} else {
			_this.emitter = emitter;
		}

		if (destination instanceof _Node2.default) {
			_this.destination = destination.id;
		} else {
			_this.destination = destination;
		}

		_this.timestamp = Date.now();

		_this.meta = meta;
		_this.meta.isCoerced = coerced; // This is more or less a flag variable to identify times when the Signal was created by converting [ trigger, ...args ] into a Signal, instead of a native Signal being passed directly (e.g. identifying whether .data as an Array is meaningful or circumstantial)

		if (override === true) {
			_this.id = id || _this.id;
			_this.timestamp = timestamp || _this.timestamp;

			_this.meta.isClone = true; // A flag so write whether or not this Signal was a clone of another Signal -- "isClone" is only present when true
		}

		/**
   * Freeze the Signal without freezing the entries
   */
		return _ret = new Proxy(_this, {
			get: function get(target, prop) {
				return Reflect.get(target, prop);
			},
			set: function set(target, prop, value) {
				if (frozenKeys.includes(prop)) {
					return target;
				}

				return Reflect.set(target, prop, value);
			},
			deleteProperty: function deleteProperty(target, prop) {
				if (frozenKeys.includes(prop)) {
					return false;
				}

				return Reflect.deleteProperty(target, prop);
			}
		}), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Signal, null, [{
		key: "Conforms",
		value: function Conforms(obj) {
			if (obj instanceof Signal) {
				return true;
			} else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
				return "id" in obj && "type" in obj && "data" in obj && "emitter" in obj
				// && "destination" in obj	// Optional
				&& "timestamp" in obj;
			}

			return false;
		}
	}, {
		key: "Copy",
		value: function Copy(msg) {
			var clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (!Signal.Conforms(msg)) {
				return false;
			}

			if (clone === true) {
				return Signal.Create(msg, { override: true, id: msg.id, timestamp: msg.timestamp });
			}

			return Signal.Create(msg);
		}
	}, {
		key: "Create",
		value: function Create() {
			var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var type = _ref3.type,
			    data = _ref3.data,
			    emitter = _ref3.emitter,
			    rest = _objectWithoutProperties(_ref3, ["type", "data", "emitter"]);

			return new Signal(_extends({ type: type, data: data, emitter: emitter }, rest), opts);
		}
	}]);

	return Signal;
}(_Agent3.default);

;

exports.default = Signal;