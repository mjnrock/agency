"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = exports.Node = function () {
	function Node() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$input = _ref.input,
		    input = _ref$input === undefined ? 1 : _ref$input,
		    _ref$output = _ref.output,
		    output = _ref$output === undefined ? 1 : _ref$output;

		_classCallCheck(this, Node);

		if (typeof input === "number") {
			this.setIn(input);
		} else {
			this.input = new Set(input);
		}

		if (typeof output === "number") {
			this.setOut(output);
		} else {
			this.output = new Set(output);
		}
	}

	_createClass(Node, [{
		key: "getIn",
		value: function getIn() {
			var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return [].concat(_toConsumableArray(this.input)).splice(port, 1)[0];
		}
	}, {
		key: "getOut",
		value: function getOut() {
			var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return [].concat(_toConsumableArray(this.output)).splice(port, 1)[0];
		}
	}, {
		key: "setIn",
		value: function setIn(portsOrQty) {
			this.input = new Set();

			if (Array.isArray(portsOrQty)) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = portsOrQty[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var port = _step.value;

						if (port instanceof Node) {
							this.input.add(port);
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

				return this;
			}

			for (var i = 0; i < portsOrQty; i++) {
				this.input.add(new Node());
			}

			return this;
		}
	}, {
		key: "setOut",
		value: function setOut(portsOrQty) {
			this.output = new Set();

			if (Array.isArray(portsOrQty)) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = portsOrQty[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var port = _step2.value;

						if (port instanceof Node) {
							this.output.add(port);
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

				return this;
			}

			for (var i = 0; i < portsOrQty; i++) {
				this.output.add(new Node());
			}

			return this;
		}
	}, {
		key: "attach",
		value: function attach(port, listener) {
			var isInPort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			if (listener instanceof Node) {
				var arr = isInPort ? this.input : this.output;

				var _splice = [].concat(_toConsumableArray(arr)).splice(port, 1),
				    _splice2 = _slicedToArray(_splice, 1),
				    p = _splice2[0];

				p.link(listener);
			}

			return this;
		}
	}, {
		key: "detach",
		value: function detach(port, listener) {
			var _splice3 = [].concat(_toConsumableArray(this.input)).splice(port, 1),
			    _splice4 = _slicedToArray(_splice3, 1),
			    input = _splice4[0];

			var _splice5 = [].concat(_toConsumableArray(this.output)).splice(port, 1),
			    _splice6 = _slicedToArray(_splice5, 1),
			    output = _splice6[0];

			input.unlink(listener);
			output.unlink(listener);

			return this;
		}
	}, {
		key: "receive",
		value: function receive(port, sender, data) {
			var p = this.getIn(port);

			if (p instanceof Node) {
				return p.receive(sender, data);
			}
		}
	}, {
		key: "send",
		value: function send(port, data) {
			var p = this.getOut(port);

			if (p instanceof Node) {
				return p.receive(this, data);
			}
		}
	}, {
		key: "size",
		get: function get() {
			return [this.input.size, this.output.size];
		}
	}]);

	return Node;
}();

;

exports.default = Node;