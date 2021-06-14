"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Repository = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _AgencyBase = require("./AgencyBase");

var _AgencyBase2 = _interopRequireDefault(_AgencyBase);

var _$Dispatchable = require("./event/$Dispatchable");

var _$Dispatchable2 = _interopRequireDefault(_$Dispatchable);

var _RepositoryEntry = require("./RepositoryEntry");

var _RepositoryEntry2 = _interopRequireDefault(_RepositoryEntry);

var _helper = require("./util/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * <Repository> **only** accepts <Object> entries with a << .id >>
 * 	property that **must** be a UUID.
 */
var Repository = exports.Repository = function (_compose) {
	_inherits(Repository, _compose);

	function Repository() {
		var _ret;

		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$config = _ref.config,
		    config = _ref$config === undefined ? {} : _ref$config,
		    _ref$hooks = _ref.hooks,
		    hooks = _ref$hooks === undefined ? {} : _ref$hooks;

		_classCallCheck(this, Repository);

		var _this = _possibleConstructorReturn(this, (Repository.__proto__ || Object.getPrototypeOf(Repository)).call(this, {
			Dispatchable: {
				hooks: hooks
			}
		}));

		_this.__config = {
			accessor: null, // (?) fn
			accessorArgs: [], // (?) any[]
			typed: null // (?) fn
		};
		_this.$config(config);

		_this.__entries = new Map();

		var proxy = new Proxy(_this, {
			get: function get(target, prop) {
				var result = Reflect.get(target, prop);

				if (prop in target) {
					return result;
				}

				if (typeof target.__config.accessor === "function") {
					return target.__config.accessor(target, prop, [result].concat(_toConsumableArray(target.__config.accessorArgs)));
				}

				return result;
			}
		});

		return _ret = proxy, _possibleConstructorReturn(_this, _ret);
	}

	/**
  * Context-dependent Getter/Setter [ #CDGS ]
  */


	_createClass(Repository, [{
		key: "$config",
		value: function $config(setting, value) {
			if ((typeof setting === "undefined" ? "undefined" : _typeof(setting)) === "object") {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Object.entries(setting)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _step$value = _slicedToArray(_step.value, 2),
						    k = _step$value[0],
						    v = _step$value[1];

						this.$config(k, v);
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

				return this.__config;
			}

			if (value !== void 0) {
				if (setting === "accessor") {
					//	The accessor acts as an entry "get" wrapper, allowing for the return value to be mutated (e.g. class entry, instance "get")
					//	The accessorArgs acts as a pre-defined set of arguments to *also* be included (e.g. "globals")
					if (typeof value === "function") {
						this.__config.accessor = value;
					} else if (Array.isArray(value) && typeof value[0] === "function") {
						this.__config.accessor = value;
						this.__config.accessorArgs = value.slice(1) || [];
					}
				} else if (setting === "typed") {
					//	This is used to accept/reject a potential entry (T: accept, F: reject)
					if (typeof value === "function") {
						this.__config.typed = value;
					}
				} else {
					this.__config[setting] = value;
				}
			}

			return this.__config;
		}

		/**
   * @entry **must** be an object.  By default, @entry must also have a
   * 	<< .id >> property that is a UUID.
   * 
   * NOTE:	The id constraint can be overridden if << @forceInjectId = true >>,
   * 	which will **mutate the original object** by injecting a UUID into it under
   * 	the id prop: << @entry.id = uuidv4() >>
   */

	}, {
		key: "register",
		value: function register(entry) {
			var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    _ref2$state = _ref2.state,
			    state = _ref2$state === undefined ? {} : _ref2$state,
			    _ref2$synonyms = _ref2.synonyms,
			    synonyms = _ref2$synonyms === undefined ? [] : _ref2$synonyms,
			    _ref2$forceInjectId = _ref2.forceInjectId,
			    forceInjectId = _ref2$forceInjectId === undefined ? false : _ref2$forceInjectId;

			if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) !== "object") {
				return false;
			} else {
				if (forceInjectId === true) {
					entry.id = (0, _uuid.v4)();
				}

				if (!(0, _uuid.validate)(entry.id)) {
					return false;
				}
			}

			var uuid = entry.id;

			//FIXME Generate an order scalar based on current situation
			var ORDER = Infinity;

			this[uuid] = entry;

			this.__entries.set(uuid, new _RepositoryEntry2.default(entry, ORDER, {
				state: state,
				synonyms: synonyms
			}));

			var eventArgs = [uuid, ORDER, synonyms];
			this.$dispatch.apply(this, [Repository.Signal.REGISTER].concat(eventArgs));

			return true;
		}
	}, {
		key: "unregister",
		value: function unregister(entrySynonymOrId) {
			var uuid = void 0;
			if ((typeof entrySynonymOrId === "undefined" ? "undefined" : _typeof(entrySynonymOrId)) === "object") {
				uuid = entrySynonymOrId.id;
			} else if ((0, _uuid.validate)(entrySynonymOrId)) {
				uuid = entrySynonymOrId;
			} else if (typeof entrySynonymOrId === "string" || entrySynonymOrId instanceof String) {
				//FIXME	Synonym lookup
			}

			var result = this.__entries.delete(uuid);

			if (result) {
				this.$dispatch(Repository.Signal.UNREGISTER, uuid);
			}

			return result;
		}
	}]);

	return Repository;
}((0, _helper.compose)(_$Dispatchable2.default)(_AgencyBase2.default));

Repository.Signal = {
	REGISTER: "Repository.Register",
	UNREGISTER: "Repository.Unregister"
};
;

exports.default = Repository;