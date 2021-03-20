"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkedListNode = exports.LinkedListNode = function LinkedListNode(data) {
	_classCallCheck(this, LinkedListNode);

	this._data = data;
	this._previous = null;
	this._next = null;
};

;

var LinkedList = exports.LinkedList = function () {
	function LinkedList() {
		_classCallCheck(this, LinkedList);

		this._length = 0;
		this._head = null;
		this._tail = null;
	}

	_createClass(LinkedList, [{
		key: "size",
		value: function size() {
			return this._length;
		}
	}, {
		key: "get",
		value: function get(index) {
			var curr = this._head,
			    i = 0;

			if (this._length === 0 || index < 0 || index > this._length - 1) {
				return false;
			}

			while (i < index) {
				curr = curr._next;
				i++;
			}

			return curr;
		}
	}, {
		key: "add",
		value: function add() {
			for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
				values[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var value = _step.value;

					var node = new LinkedListNode(value);

					if (this._length > 0) {
						this._tail._next = node;
						node._previous = this._tail;
						this._tail = node;
					} else {
						this._head = node;
						this._tail = node;
					}

					this._length++;
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
		value: function remove(index) {
			if (this._length === 0 || index < 0 || index > this._length - 1) {
				return false;
			}

			if (index === 0) {
				if (!this._head._next) {
					this._head = null;
					this._tail = null;
				} else {
					this._head = this._head._next;
				}
			} else if (index === this._length - 1) {
				this._tail = this._tail._previous;
			} else {
				var i = 0,
				    curr = this._head;
				while (i < index) {
					curr = curr._next;
					i++;
				}

				curr._previous._next = curr._next;
				curr._next._previous = curr._previous;
			}

			this._length--;
			if (this._length === 1) {
				this._tail = this._head;
			}
			if (this._length > 0) {
				this._head._previous = null;
				this._tail._next = null;
			}

			return this;
		}
	}]);

	return LinkedList;
}();

;

exports.default = LinkedList;