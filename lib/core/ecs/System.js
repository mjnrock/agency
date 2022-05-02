"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.System = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Agent2 = require("../Agent");

var _Agent3 = _interopRequireDefault(_Agent2);

var _Module = require("./Module");

var _Module2 = _interopRequireDefault(_Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//TODO Figure out a place to do a System Dictionary
/**
 * This should eventually be either turned into a Singleton, or
 * instantiated on a global dictionary that would be get-ed and
 * used in a singleton/global-like capacity.
 */
var System = exports.System = function (_Agent) {
	_inherits(System, _Agent);

	function System(nomen) {
		var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		var _ret;

		var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
		    state = _ref.state,
		    _ref$Agent = _ref.Agent,
		    Agent = _ref$Agent === undefined ? {} : _ref$Agent;

		_classCallCheck(this, System);

		// System expects this to match a Module.nomen exactly
		var _this = _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this, _extends({}, Agent, { state: state })));

		_this.nomen = nomen;

		_this.toggle("isReducer", false);

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _step$value = _slicedToArray(_step.value, 2),
				    trigger = _step$value[0],
				    handlers = _step$value[1];

				if (!Array.isArray(handlers)) {
					handlers = [handlers];
				}

				_this.addTrigger.apply(_this, [trigger].concat(_toConsumableArray(handlers)));
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

		return _ret = new Proxy(_this, {
			get: function get(target, prop) {
				if (typeof prop === "string" && prop[0] === "$") {
					return function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return target.invoke.apply(target, [prop.substring(1)].concat(args));
					};
				}

				return Reflect.get(target, prop);
			}
		}), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(System, [{
		key: "check",
		value: function check(entity) {
			return !!entity[this.nomen];
		}
	}, {
		key: "get",
		value: function get(entity) {
			return entity[this.nomen];
		}

		/**
   * A convenience wrapper for Module.Add that already includes @this references,
   * thus allowing System to act in a factory-like capacity, given an @entity
   * and a @componentClass
   */

	}, {
		key: "register",
		value: function register(entity, componentClass) {
			var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
			    _ref2$args = _ref2.args,
			    args = _ref2$args === undefined ? [] : _ref2$args,
			    _ref2$tags = _ref2.tags,
			    tags = _ref2$tags === undefined ? [] : _ref2$tags,
			    moduleClass = _ref2.moduleClass;

			if (Array.isArray(entity)) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = entity[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var ent = _step2.value;

						(moduleClass || _Module2.default).Register(this.nomen, { entity: ent, componentClass: componentClass, system: this, args: args, tags: tags });
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

			return (moduleClass || _Module2.default).Register(this.nomen, { entity: entity, componentClass: componentClass, system: this, args: args, tags: tags });
		}

		/**
   * This is confusing AF, but it can act in a couple different ways:
   * 	1) By passing an @entity alone, it will return the invocation
   * 		convenience method ($) on the the mapped-Module to this.nomen
   * 	2) If @entity is an array, it expects @trigger and optional @args
   * 		which it will invoke on each passed entity via ($) using the
   * 		same constaints as (1)
   * 	3) If @entity is not an array, it works exactly as if you invoked
   * 		the @trigger w/ @args directly on the entity's Module mapped
   * 		to this.nomen
   */

	}, {
		key: "$",
		value: function $(entity, trigger) {
			for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
				args[_key2 - 2] = arguments[_key2];
			}

			// Invoke on each entity and save the result in a Map, mapped to the entity
			if (Array.isArray(entity)) {
				var ret = new Map();
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = entity[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var ent = _step3.value;

						ret.set(entity, this.$.apply(this, [ent, trigger].concat(args)));
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				return ret;
			}

			// Invoke this.nomen-module on @entity directly
			if (trigger !== void 0) {
				var _entity$nomen;

				return (_entity$nomen = entity[this.nomen]).$.apply(_entity$nomen, [trigger].concat(args));
			}

			// Return a function that can later be passed (trigger, ...args)
			return entity[this.nomen].$;
		}
	}, {
		key: "a$",
		value: async function a$(entity, trigger) {
			for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
				args[_key3 - 2] = arguments[_key3];
			}

			return await this.$.apply(this, [entity, trigger].concat(args));
		}

		//? Reminder
		// [
		// 	args,
		// 	{
		// 		namespace: this.config.namespace,
		// 		trigger: trigger,
		// 		target: this,
		// 		state: this.state,
		// 		invoke: this.invoke,

		// 		...this.config.globals,
		// 	}
		// ];
		// /**
		//  * Example handler
		//  */
		// onTrigger([ moduleInstance, ...args ], obj = {}) {

		// }

	}]);

	return System;
}(_Agent3.default);

;

exports.default = System;