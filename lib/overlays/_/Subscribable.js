"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Subscribable = undefined;

var _Node = require("../node/Node");

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Subscribable = exports.Subscribable = function Subscribable(target) {
	return {
		$pre: function $pre(node, overlay) {
			node._subscriptions = new Set();
		},
		$post: function $post(node, overlay) {},


		// state: {},
		// nodes: {},
		triggers: ["receive", "subscribe", "unsubscribe"],
		// subscriptions: new Set(),
		// meta: {},
		// config: {},
		actions: {
			addSubscriber: function addSubscriber() {
				var subscribers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var twoWay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

				if (!Array.isArray(subscribers)) {
					subscribers = [subscribers];
				}

				var newSubscribers = [];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = subscribers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var subscriber = _step.value;

						if (subscriber !== target && (subscriber instanceof _Node2.default || typeof subscriber === "function")) {
							target.subscriptions.add(subscriber);

							if (twoWay && subscriber instanceof _Node2.default) {
								subscriber.subscriptions.add(target);
							}

							newSubscribers.push(subscriber);
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

				if (newSubscribers.length) {
					target.actions.invoke("subscribe", newSubscribers);
				}

				return target;
			},
			removeSubscriber: function removeSubscriber() {
				var subscribers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var twoWay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

				if (!Array.isArray(subscribers)) {
					subscribers = [subscribers];
				}

				var unsubscribers = [];
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var subscriber = _step2.value;

						var result = target.subscriptions.delete(subscriber);

						if (twoWay && subscriber instanceof _Node2.default) {
							subscriber.subscriptions.delete(target);
						}

						if (result) {
							unsubscribers.push(subscriber);
						}

						unsubscribers.push(subscriber);
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

				if (unsubscribers.length) {
					target.actions.invoke("unsubscribe", unsubscribers);
				}

				return target;
			},
			subscribeTo: function subscribeTo(node) {
				if (node instanceof _Node2.default) {
					node.actions.addSubscriber(target);
				}

				return target;
			},
			unsubscribeFrom: function unsubscribeFrom(node) {
				if (node instanceof _Node2.default) {
					node.actions.addSubscriber(target);
				}

				return target;
			},
			receive: function receive(emitter) {
				if (target !== emitter) {
					var _target$actions;

					for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						args[_key - 1] = arguments[_key];
					}

					(_target$actions = target.actions).invoke.apply(_target$actions, ["receive", emitter].concat(args));
				}

				return target;
			},
			broadcast: function broadcast() {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = target.subscriptions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var subscriber = _step3.value;

						if (subscriber instanceof _Node2.default) {
							var _subscriber$actions;

							(_subscriber$actions = subscriber.actions).receive.apply(_subscriber$actions, [target].concat(args));
						} else if (typeof subscriber === "function") {
							subscriber.apply(undefined, [target].concat(args));
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

				return target;
			}
		}
	};
};

exports.default = Subscribable;