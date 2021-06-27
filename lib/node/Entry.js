"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Entry = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emitter2 = require("../event/Emitter");

var _Emitter3 = _interopRequireDefault(_Emitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entry = exports.Entry = function (_Emitter) {
	_inherits(Entry, _Emitter);

	function Entry(type, data) {
		var _ret;

		var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
		    _ref$meta = _ref.meta,
		    meta = _ref$meta === undefined ? {} : _ref$meta,
		    scheme = _ref.scheme,
		    _ref$readOnly = _ref.readOnly,
		    readOnly = _ref$readOnly === undefined ? false : _ref$readOnly;

		_classCallCheck(this, Entry);

		var _this = _possibleConstructorReturn(this, (Entry.__proto__ || Object.getPrototypeOf(Entry)).call(this));

		_this.type = type;
		_this.data = data;

		_this.meta = _extends({
			isReadOnly: readOnly,
			scheme: scheme
		}, meta);

		_this.hook({
			change: function () {
				this.onChange.apply(this, arguments);
			}.bind(_this),
			true: function () {
				this.onTrue.apply(this, arguments);
			}.bind(_this),
			false: function () {
				this.onFalse.apply(this, arguments);
			}.bind(_this),

			$globals: {
				entry: _this
			}
		});

		return _ret = new Proxy(_this, {
			set: function set(target, prop, value) {
				if (prop === "type") {
					return target;
				}

				if (prop === "data") {
					if (target.meta.isReadOnly) {
						return target;
					}

					var oldData = target.data;
					var shouldUpdate = true;

					if (target.meta.scheme != null) {
						shouldUpdate = false;
						var _scheme = target.meta.scheme;

						if (typeof _scheme === "function") {
							_scheme = _scheme(value, target);
						}

						if (typeof _scheme === "boolean") {
							shouldUpdate = result;
						} else if (_scheme instanceof RegExp) {
							shouldUpdate = _scheme.test(value);
						} else if ((typeof _scheme === "undefined" ? "undefined" : _typeof(_scheme)) === "object") {
							_scheme = Object.values(_scheme);

							if (Array.isArray(_scheme)) {
								shouldUpdate = _scheme.includes(value);
							}
						}
					}

					if (shouldUpdate) {
						target.data = value;

						target.emit("change", target.data, oldData);
					}

					return target;
				}

				return Reflect.set(target, prop, value);
			}
		}), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Entry, [{
		key: "setByKey",
		value: function setByKey(indexOrKey) {
			var options = this.meta.options;

			if (typeof options === "function") {
				options = options(data, this);
			}

			if (typeof indexOrKey === "number") {
				if (Array.isArray(options)) {
					this.data = options[indexOrKey];
				} else if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
					this.data = Object.values(options)[indexOrKey];
				}
			} else if (typeof indexOrKey === "string" || indexOrKey instanceof String) {
				this.data = options[indexOrKey];
			}

			return this;
		}
	}, {
		key: "onChange",
		value: function onChange(msg) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		}
	}, {
		key: "onTrue",
		value: function onTrue(msg) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		}
	}, {
		key: "onFalse",
		value: function onFalse(msg) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		}
	}, {
		key: "toObject",
		value: function toObject() {
			var obj = Object.assign({}, this);

			if (obj.meta.scheme instanceof RegExp || typeof obj.meta.scheme === "function") {
				obj.meta.scheme = obj.meta.scheme.toString();
			}

			if (this.children instanceof Set) {
				obj.children = [];

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var child = _step.value;

						obj.children.push(child.toObject());
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
			}

			return obj;
		}
	}, {
		key: "toJSON",
		value: function toJSON() {
			var replacer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var space = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			return JSON.stringify(this.toObject(), replacer, space);
		}
	}], [{
		key: "Conforms",
		value: function Conforms(obj) {
			return "type" in obj && "data" in obj && "meta" in obj;
		}
	}, {
		key: "FromObject",
		value: function FromObject(obj) {
			if (this.Conforms(obj)) {
				return new Entry(obj.type, obj.data, {
					meta: obj.meta
				});
			}

			return false;
		}
	}, {
		key: "FromJson",
		value: function FromJson(json) {
			var obj = json;

			while (typeof obj === "string" || obj instanceof String) {
				obj = JSON.parse(obj);
			}

			return this.FromObject(obj);
		}
	}]);

	return Entry;
}(_Emitter3.default);

;

exports.default = Entry;