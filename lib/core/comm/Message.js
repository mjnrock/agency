"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Message = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = exports.Message = function () {
	function Message(data) {
		var tags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
		    id = _ref.id,
		    _ref$info = _ref.info,
		    info = _ref$info === undefined ? {} : _ref$info;

		var isLocked = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		_classCallCheck(this, Message);

		this.id = id || (0, _uuid.v4)();

		this.data = data;
		this.tags = tags instanceof Set ? tags : new Set(Array.isArray(tags) ? tags : [tags]);
		this.timestamp = Date.now();

		this.info = _extends({
			isLocked: isLocked

		}, info);

		return new Proxy(this, {
			get: function get(target, prop) {
				return Reflect.get(target, prop);
			},
			set: function set(target, prop, value) {
				if (target.info.isLocked === true) {
					return true;
				}

				return Reflect.set(target, prop, value);
			},
			deleteProperty: function deleteProperty(target, prop) {
				if (target.info.isLocked === true) {
					return true;
				}

				return Reflect.deleteProperty(target, prop);
			},
			defineProperty: function defineProperty(target, prop) {
				if (target.info.isLocked === true) {
					return true;
				}

				return Reflect.defineProperty(target, prop, attr);
			}
		});
	}

	/**
  * Since Messages will often be used with only one tag (i.e. functioning in the capacity of a ".type"), this abstracts that convenience
  */


	_createClass(Message, [{
		key: "copy",


		/**
   * If @input = true, the clone the Message
   * If @input is an object, copy with those overwrites
   * Else, create a copy of Message without changes
   */
		value: function copy() {
			var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (input === true) {
				return Message.Factory(1, this.data, this.tags, {
					id: this.id,
					info: this.info
				});
			} else if ((typeof input === "undefined" ? "undefined" : _typeof(input)) === "object") {
				return Message.Factory(1, input.data !== void 0 ? input.data : this.data, input.tags || this.tags, {
					id: input.id,
					info: input.info || this.info
				});
			}

			return Message.Factory(1, this.data, this.tags, {
				info: this.info
			});
		}
	}, {
		key: "toObject",
		value: function toObject() {
			return _extends({}, this);
		}
	}, {
		key: "toJson",
		value: function toJson() {
			return JSON.stringify(this.toObject());
		}
	}, {
		key: "type",
		get: function get() {
			return this.tags.values().next().value;
		}

		/**
   * Convenience wrapper for Messages carrying Promise-payloads
   */

	}, {
		key: "then",
		get: function get() {
			return Promise.resolve(this.data);
		}
	}], [{
		key: "FromObject",
		value: function FromObject() {
			var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return Message.Copy(obj, true);
		}
	}, {
		key: "FromJson",
		value: function FromJson(json) {
			var maxLoop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

			var obj = json;

			var i = 0;
			while ((typeof obj === "string" || obj instanceof String) && i < maxLoop) {
				obj = JSON.parse(json);
				++i;
			}

			return Message.FromObject(obj);
		}
	}, {
		key: "Conforms",
		value: function Conforms(obj) {
			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") {
				return false;
			}

			return "id" in obj && "tags" in obj && "data" in obj && "config" in obj && "timestamp" in obj;
		}
	}, {
		key: "Copy",
		value: function Copy(msg) {
			var clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (clone === true) {
				return Message.Factory(1, msg.data, msg.tags, { id: msg.id, config: msg.config });
			}

			return Message.Factory(1, msg.data, msg.tags, { config: msg.config });
		}
	}, {
		key: "Factory",
		value: function Factory() {
			var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			var ret = [];

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			for (var i = 0; i <= qty; i++) {
				ret.push(new (Function.prototype.bind.apply(Message, [null].concat(args)))());
			}

			if (qty === 1) {
				return ret[0];
			}

			return ret;
		}
	}, {
		key: "Generate",
		value: function Generate() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			return Message.Factory.apply(Message, [1].concat(args));
		}
	}]);

	return Message;
}();

;

exports.default = Message;