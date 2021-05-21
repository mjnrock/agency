"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MessageCollection = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageCollection = exports.MessageCollection = function () {
	function MessageCollection() {
		var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		var _ref = arguments[1];
		var _ref$capacity = _ref.capacity,
		    capacity = _ref$capacity === undefined ? Infinity : _ref$capacity,
		    _ref$current = _ref.current,
		    current = _ref$current === undefined ? 0 : _ref$current,
		    sorter = _ref.sorter,
		    middleware = _ref.middleware;

		_classCallCheck(this, MessageCollection);

		this.messages = new Set();
		this.addMany(messages);

		this.capacity = capacity;
		this._current = current;
		this.sorter = sorter;
		this.middleware = middleware;
	}

	_createClass(MessageCollection, [{
		key: "next",
		value: function next() {
			this.current += 1;

			return this.current;
		}
	}, {
		key: "previous",
		value: function previous() {
			this.current -= 1;

			return this.current;
		}
	}, {
		key: "reset",
		value: function reset() {
			var _range = _slicedToArray(this.range, 1),
			    min = _range[0];

			this.current = min;

			return this.current;
		}
	}, {
		key: "add",
		value: function add(message) {
			if (!this.isFull) {
				this.messages.add(message);
			}

			return this;
		}
	}, {
		key: "remove",
		value: function remove(message) {
			this.messages.delete(message);

			return this;
		}
	}, {
		key: "addMany",
		value: function addMany() {
			var addArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = addArgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var message = _step.value;

					this.add(message);
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
		key: "remove",
		value: function remove() {
			var removeArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = removeArgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var message = _step2.value;

					this.remove(message);
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
		key: "set",
		value: function set() {
			var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			this.messages = new Set(messages);
		}
	}, {
		key: "get",
		value: function get() {
			return [].concat(_toConsumableArray(this.messages)).map(function (m) {
				return _Message2.default.Generate(m.toObject());
			});
		}
	}, {
		key: "inject",
		value: function inject(network, middleware) {
			var messages = this.get();
			if (typeof this.sorter === "function") {
				messages = this.sorter(messages);
			}

			if (typeof middleware === "function") {
				network.collection(messages, middleware);
			} else {
				network.collection(messages, this.middleware);
			}
		}
	}, {
		key: "getHash",
		value: function getHash() {
			var algorithm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "md5";
			var digest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hex";

			var hashes = [].concat(_toConsumableArray(this.messages)).map(function (m) {
				return m.getHash(algorithm, digest);
			}).toString();

			return _crypto2.default.createHash(algorithm).update(hashes).digest(digest);
		}
	}, {
		key: "toObject",
		value: function toObject() {
			return [].concat(_toConsumableArray(this.messages)).map(function (m) {
				return m.toObject();
			});
		}
	}, {
		key: "toJson",
		value: function toJson() {
			return [].concat(_toConsumableArray(this.messages)).map(function (m) {
				return m.toJson();
			});
		}
	}, {
		key: "isFull",
		get: function get() {
			return this.messages.size >= this.capacity;
		}
	}, {
		key: "remaining",
		get: function get() {
			return this.capacity - this.messages.size;
		}
	}, {
		key: "current",
		get: function get() {
			return [].concat(_toConsumableArray(this.messages))[this._current];
		},
		set: function set(value) {
			this._current = value;

			var _range2 = _slicedToArray(this.range, 2),
			    min = _range2[0],
			    max = _range2[1];

			if (this.current > max) {
				this._current = 0;
			} else if (this.current < min) {
				this._current = max;
			}
		}
	}, {
		key: "hasNext",
		get: function get() {
			var _range3 = _slicedToArray(this.range, 1),
			    max = _range3[0];

			return this._current < max;
		}
	}, {
		key: "hasPrevious",
		get: function get() {
			var _range4 = _slicedToArray(this.range, 1),
			    min = _range4[0];

			return this._current > min;
		}
	}, {
		key: "range",
		get: function get() {
			var min = 0,
			    max = this.messages.size - 1;


			if (this.current >= max) {
				this.current = 0;
			} else if (this.current <= min) {
				this.current = max;
			}

			return [min, max];
		}
	}], [{
		key: "FromObject",
		value: function FromObject() {
			var messageArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			return new MessageCollection(messageArray.map(function (mo) {
				return _Message2.default.FromObject(mo);
			}));
		}
	}, {
		key: "FromJson",
		value: function FromJson() {
			var messageArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			return new MessageCollection(messageArray.map(function (mj) {
				return _Message2.default.FromJson(mj);
			}));
		}
	}]);

	return MessageCollection;
}();

;

exports.default = MessageCollection;