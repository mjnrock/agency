"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TriggerTest = exports.Router = exports.fnDefaultRoute = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Node = require("../node/Node");

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Any <Node> that acts as a @handler will receive a
 * 	"route" trigger invocation whenever << Router.route >>
 * 	is called.  As such, the handler-Node should have a
 * 	"route" handler within its event base.
 */

var fnDefaultRoute = exports.fnDefaultRoute = function fnDefaultRoute() {
	return true;
};

var Router = exports.Router = function Router(target) {
	return {
		state: {
			//TODO Only the variables exist, not the functionality to utilize a queue
			queue: new Set()
		},
		// nodes: {},
		triggers: {
			receive: [function (_ref) {
				var node = _ref.target,
				    trigger = _ref.trigger;
				return function (emitter) {
					var _node$actions;

					for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						args[_key - 1] = arguments[_key];
					}

					return (_node$actions = node.actions).route.apply(_node$actions, args);
				};
			}]
		},
		// subscriptions: [],
		// meta: {},
		config: {
			routes: [],
			isMultiMatch: false,
			isBatchProcessing: false,
			maxQueueSize: Infinity
		},
		actions: {
			toggleMultiMatch: function toggleMultiMatch(bool) {
				if (typeof bool === "boolean") {
					target.meta.config.isMultiMatch = bool;
				} else {
					target.meta.config.isMultiMatch = !target.meta.config.isMultiMatch;
				}

				return target.meta.config.isMultiMatch;
			},
			addRoute: function addRoute(filter, handler) {
				target.meta.config.routes.push([filter, handler]);

				return target;
			},
			addRoutes: function addRoutes() {
				var addRouteArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = addRouteArgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _step$value = _slicedToArray(_step.value, 2),
						    filter = _step$value[0],
						    handler = _step$value[1];

						target.addRoute(filter, handler);
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

				return target;
			},
			removeRoute: function removeRoute(filter, handler) {
				target.meta.config.routes = target.meta.config.routes.filter(function (_ref2) {
					var _ref3 = _slicedToArray(_ref2, 2),
					    f = _ref3[0],
					    h = _ref3[1];

					return !(f === filter && h === handler);
				});

				return target;
			},
			removeRoutes: function removeRoutes() {
				var removeRouteArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = removeRouteArgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _step2$value = _slicedToArray(_step2.value, 2),
						    filter = _step2$value[0],
						    handler = _step2$value[1];

						target.removeRoute(filter, handler);
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

				return target;
			},


			/**
    * This will create a defaulting routing to the @node
    */
			addReceiver: function addReceiver(node) {
				return target.actions.addRoute(fnDefaultRoute, node);
			},
			removeReceiver: function removeReceiver(node) {
				return target.actions.removeRoute(fnDefaultRoute, node);
			},
			route: function route() {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = target.meta.config.routes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var _step3$value = _slicedToArray(_step3.value, 2),
						    filter = _step3$value[0],
						    handler = _step3$value[1];

						var hasResult = false;

						var receiver = handler;
						if (typeof filter === "function") {
							var result = filter.apply(undefined, args);

							if (result === true) {
								if (handler instanceof _Node2.default) {
									var _handler$actions;

									(_handler$actions = handler.actions).invoke.apply(_handler$actions, ["route", target].concat(args));
								} else {
									receiver.apply(undefined, [target].concat(args));
								}

								hasResult = true;
							}
						}

						//TODO Introduce @type/.type specificity for regexp/string matching
						/*if(typeof filter === "string") {
      	if(true) {
      		receiver(node, ...args);
      		hasResult = true;
      	}
      } else if(filter instanceof RegExp) {
      	if(true) {
      		receiver(node, ...args);
      		hasResult = true;
      	}
      }*/

						if (hasResult === true && target.meta.config.isMultiMatch === false) {
							return target;
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

var TriggerTest = exports.TriggerTest = {
	Loose: function Loose(input) {
		return function (trigger) {
			return trigger == input;
		};
	},
	Equals: function Equals(type) {
		return function (trigger) {
			return trigger === type;
		};
	},
	Includes: function Includes() {
		var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		return function (trigger) {
			return types.includes(trigger);
		};
	},
	Match: function Match(regex) {
		return function (trigger) {
			return regex.test(trigger.toString());
		};
	}
};

exports.default = Router;