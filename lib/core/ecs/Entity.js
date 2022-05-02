"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Entity = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Agent2 = require("../Agent");

var _Agent3 = _interopRequireDefault(_Agent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entity = exports.Entity = function (_Agent) {
	_inherits(Entity, _Agent);

	function Entity() {
		var _ret;

		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    state = _ref.state,
		    _ref$Agent = _ref.Agent,
		    Agent = _ref$Agent === undefined ? {} : _ref$Agent;

		_classCallCheck(this, Entity);

		var _this = _possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).call(this, _extends({}, Agent, { state: state })));

		_this.modules = new Map();

		return _ret = new Proxy(_this, {
			get: function get(target, prop) {
				if (!(prop in target)) {
					/**
      * NOTE: This is singularly used to access the Module.state (i.e. Component) directly,
      * via a << Entity[ module.name ] >> syntax.  See note in Component.
      */
					if (target.modules.has(prop)) {
						return target.modules.get(prop).state;
					}
				}

				return Reflect.get(target, prop);
			}
		}), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Entity, [{
		key: "register",
		value: function register(key, value) {
			this.modules.set(key, value);

			return this;
		}
	}, {
		key: "unregister",
		value: function unregister(key, value) {
			return this.modules.delete(key, value);
		}
	}, {
		key: "find",
		value: function find() {
			var ret = new Set();

			for (var _len = arguments.length, nameIdOrTags = Array(_len), _key = 0; _key < _len; _key++) {
				nameIdOrTags[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = nameIdOrTags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var input = _step.value;

					if (this.modules.has(input)) {
						// @input is a name
						ret.add(this.modules.get(input));
					} else {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = this.modules.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var module = _step2.value;

								if (module.tags.has(input)) {
									// @input is a tag
									ret.add(module);
								} else if (module.id === input) {
									// @input is an id
									ret.add(module);
								}
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}
					}
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

			return [].concat(_toConsumableArray(ret));
		}
	}]);

	return Entity;
}(_Agent3.default);

;

exports.default = Entity;