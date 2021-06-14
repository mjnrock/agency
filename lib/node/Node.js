"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Node = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require("util");

var _AgencyBase2 = require("../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = exports.Node = function (_AgencyBase) {
	_inherits(Node, _AgencyBase);

	function Node() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$state = _ref.state,
		    state = _ref$state === undefined ? {} : _ref$state,
		    _ref$reducers = _ref.reducers,
		    reducers = _ref$reducers === undefined ? [] : _ref$reducers,
		    _ref$listeners = _ref.listeners,
		    listeners = _ref$listeners === undefined ? [] : _ref$listeners,
		    _ref$meta = _ref.meta,
		    meta = _ref$meta === undefined ? {} : _ref$meta,
		    _ref$config = _ref.config,
		    config = _ref$config === undefined ? {} : _ref$config;

		_classCallCheck(this, Node);

		var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

		_this.meta = meta;
		_this.state = state;

		_this.reducers = new Set(reducers);
		_this.listeners = new Set(listeners);

		_this.config = _extends({
			isLocked: false }, config);
		return _this;
	}

	_createClass(Node, [{
		key: "toggle",
		value: function toggle(entry) {
			this.config[entry] = !this.config[entry];

			return this;
		}
	}, {
		key: "add",
		value: function add(reducer) {
			if (typeof reducer === "function") {
				this.reducers.add(reducer);
			}

			return this;
		}
	}, {
		key: "remove",
		value: function remove(reducer) {
			return this.reducers.delete(reducer);
		}
	}, {
		key: "link",
		value: function link(node) {
			this.listeners.add(node);

			return this;
		}
	}, {
		key: "linkMany",
		value: function linkMany() {
			var linkArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = linkArgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var args = _step.value;

					this.link.apply(this, _toConsumableArray(args));
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

			return this;
		}
	}, {
		key: "unlink",
		value: function unlink(node) {
			return this.listeners.delete(node);
		}
	}, {
		key: "unlinkMany",
		value: function unlinkMany() {
			var unlinkArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = unlinkArgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var args = _step2.value;

					this.unlink.apply(this, _toConsumableArray(args));
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

			return this;
		}
	}, {
		key: "receive",
		value: function receive(data, sender) {
			if (this.config.isLocked) {
				return false;
			}

			var newState = Object.assign({}, this.state);
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.reducers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var reducer = _step3.value;

					if (typeof reducer === "function") {
						newState = reducer(data, newState, sender || this);
					}
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

			if ((0, _util.isDeepStrictEqual)(newState, this.state)) {
				return false;
			} else {
				this.state = newState;
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.listeners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var listener = _step4.value;

					if (listener instanceof Node) {
						listener.receive(this.state, this);
					} else if (typeof listener === "function") {
						listener(this.state, this);
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
	}]);

	return Node;
}(_AgencyBase3.default);

;

exports.default = Node;