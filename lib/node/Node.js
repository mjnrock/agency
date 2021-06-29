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
		    config = _ref$config === undefined ? {} : _ref$config,
		    _ref$children = _ref.children,
		    children = _ref$children === undefined ? [] : _ref$children,
		    _ref$refs = _ref.refs,
		    refs = _ref$refs === undefined ? [] : _ref$refs;

		_classCallCheck(this, Node);

		var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

		_this.meta = _extends({
			children: new Set(children),
			refs: new Map(refs)
		}, meta);
		_this.state = state;

		_this.reducers = new Set(reducers);
		_this.listeners = new Set(listeners);

		_this.config = _extends({
			isLocked: false }, config);
		return _this;
	}

	_createClass(Node, [{
		key: "child",
		value: function child() {
			var _this2 = this;

			var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			if (Array.isArray(index)) {
				return Object.fromEntries(index.map(function (i) {
					return [i, _this2.child(i)];
				}));
			}

			return [].concat(_toConsumableArray(this.meta.children))[index];
		}
	}, {
		key: "ref",
		value: function ref(key) {
			var _this3 = this;

			if (Array.isArray(key)) {
				return Object.fromEntries(key.map(function (k) {
					return [k, _this3.ref(k)];
				}));
			}

			return this.meta.refs.get(key);
		}
	}, {
		key: "toggle",
		value: function toggle(entry) {
			this.config[entry] = !this.config[entry];

			return this;
		}
	}, {
		key: "flagOn",
		value: function flagOn(entry) {
			this.config[entry] = true;

			return this;
		}
	}, {
		key: "flagOff",
		value: function flagOff(entry) {
			this.config[entry] = false;

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
		key: "attach",
		value: function attach(node) {
			if (node instanceof Node) {
				this.meta.children.add(node);
			}

			return this;
		}
	}, {
		key: "attachMany",
		value: function attachMany() {
			var connectArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = connectArgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var args = _step.value;

					this.attach.apply(this, _toConsumableArray(args));
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
		key: "detach",
		value: function detach(node) {
			if (node instanceof Node) {
				return this.meta.children.delete(node);
			}

			return false;
		}
	}, {
		key: "detachMany",
		value: function detachMany() {
			var disconnectArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = disconnectArgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var args = _step2.value;

					this.detach.apply(this, _toConsumableArray(args));
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
		key: "listen",
		value: function listen(node) {
			this.listeners.add(node);

			return this;
		}
	}, {
		key: "listenMany",
		value: function listenMany() {
			var linkArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = linkArgs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var args = _step3.value;

					this.listen.apply(this, _toConsumableArray(args));
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

			return this;
		}
	}, {
		key: "unlisten",
		value: function unlisten(node) {
			return this.listeners.delete(node);
		}
	}, {
		key: "unlistenMany",
		value: function unlistenMany() {
			var unlinkArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = unlinkArgs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var args = _step4.value;

					this.unlisten.apply(this, _toConsumableArray(args));
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

			return this;
		}
	}, {
		key: "emit",
		value: function emit(data) {
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.listeners[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var listener = _step5.value;

					if (listener instanceof Node) {
						listener.receive(data, this);
					} else if (typeof listener === "function") {
						listener(data, this);
					}
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
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
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this.reducers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var reducer = _step6.value;

					if (typeof reducer === "function") {
						newState = reducer(data, sender, newState);
					}
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			if ((0, _util.isDeepStrictEqual)(newState, this.state)) {
				return false;
			} else {
				this.state = newState;
			}

			this.emit(this.state);

			return this;
		}
	}, {
		key: "selfPropagate",
		value: function selfPropagate() {
			this.propagate(this.state);

			return this;
		}
	}, {
		key: "propagate",
		value: function propagate(data) {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = this.children[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var child = _step7.value;

					child.receive(data, this);
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return this;
		}
	}, {
		key: "children",
		get: function get() {
			return this.meta.children;
		}
	}, {
		key: "refs",
		get: function get() {
			return this.meta.refs;
		}
	}]);

	return Node;
}(_AgencyBase3.default);

;

exports.default = Node;