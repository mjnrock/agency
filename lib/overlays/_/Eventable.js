"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Eventable = exports.Eventable = function Eventable(target) {
	return {
		/**
   * This will execute directly *after* Eventable(node) has been evaluated
   * 	but before any other entries have been be evaluated
   */
		$pre: function $pre(node, overlay) {
			node._triggers = new Map();
		},

		/**
   * This will after *all* other overlay entries have been processed
   */
		$post: function $post(node, overlay) {},


		// state: {},
		// nodes: {},
		triggers: ["*", // Pre-trigger hook -- all handlers will execute before trigger handlers
		"**", // Post-trigger hook -- all handlers will execute after trigger handlers
		"@", // Filter hook -- Any return value *except* TRUE will immediately return (i.e. qty > 1 --> conjunctive)
		"update", // Invoke state change -- Add reducers here to sequentially update state if setup as reducer (config.isReducer must be true)
		"merge", // Invoke state change -- Add reducers here to sequentially update state if setup as merge reducer (config.isReducer must be true)
		"state"],
		// subscriptions: [],
		// meta: {},
		config: {
			isReducer: false
		},
		actions: {
			toggleReducer: function toggleReducer(bool) {
				if (typeof bool === "boolean") {
					target.meta.config.isReducer = bool;
				} else {
					target.meta.config.isReducer = !target.meta.config.isReducer;
				}

				return target.meta.config.isReducer;
			},
			invoke: function invoke(trigger) {
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				if (!(target.triggers.get(trigger) instanceof Set)) {
					target.triggers.delete(trigger);

					return target;
				}

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = target.triggers.get("@")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var filter = _step.value;

						var result = filter({ target: target, trigger: "@" }).apply(undefined, args);

						if (result !== true) {
							return target;
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

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = target.triggers.get("*")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _handler2 = _step2.value;

						_handler2({ target: target, trigger: "*" }).apply(undefined, args);
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

				if (target.meta.config.isReducer && (trigger === "update" || trigger === "merge")) {
					var state = args[0];
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = target.triggers.get(trigger)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var handler = _step3.value;

							state = handler({ target: target, trigger: trigger }).apply(undefined, args);
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

					var oldState = target.state;
					if (trigger === "update") {
						target.state = state;
					} else if (trigger === "merge") {
						if (Array.isArray(target.state)) {
							target.state = [].concat(_toConsumableArray(oldState), _toConsumableArray(state));
						} else {
							target.state = _extends({}, oldState, state);
						}
					}

					if (state !== oldState) {
						target.actions.invoke("state", state, oldState);
					}
				} else {
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = target.triggers.get(trigger)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _handler = _step4.value;

							_handler({ target: target, trigger: trigger, update: function update() {
									var _target$actions;

									for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
										args[_key2] = arguments[_key2];
									}

									return (_target$actions = target.actions).invoke.apply(_target$actions, ["update"].concat(args));
								}, asyncUpdate: function asyncUpdate() {
									var _target$actions2;

									for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
										args[_key3] = arguments[_key3];
									}

									return (_target$actions2 = target.actions).asyncInvoke.apply(_target$actions2, ["update"].concat(args));
								} }).apply(undefined, args);
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

				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = target.triggers.get("**")[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var _handler3 = _step5.value;

						_handler3({ target: target, trigger: "**" }).apply(undefined, args);
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

				return target;
			},
			asyncInvoke: async function asyncInvoke(trigger) {
				var _target$actions3;

				for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
					args[_key4 - 1] = arguments[_key4];
				}

				return await (_target$actions3 = target.actions).invoke.apply(_target$actions3, [trigger].concat(args));
			},
			addHandler: function addHandler(trigger) {
				if (!(target.triggers.get(trigger) instanceof Set)) {
					target.triggers.set(trigger, new Set());
				}

				for (var _len5 = arguments.length, fns = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
					fns[_key5 - 1] = arguments[_key5];
				}

				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = fns[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var fn = _step6.value;

						if (typeof fn === "function") {
							target.triggers.get(trigger).add(fn);
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

				return target;
			},
			addHandlers: function addHandlers() {
				var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = addHandlerArgs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var _step7$value = _toArray(_step7.value),
						    trigger = _step7$value[0],
						    _fns = _step7$value.slice(1);

						target.addHandler.apply(target, [trigger].concat(_toConsumableArray(_fns)));
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

				return target;
			},
			removeHandler: function removeHandler(trigger) {
				if (!(target.triggers.get(trigger) instanceof Set)) {
					return target;
				}

				for (var _len6 = arguments.length, fns = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
					fns[_key6 - 1] = arguments[_key6];
				}

				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = fns[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var fn = _step8.value;

						target.triggers.get(trigger).delete(fn);
					}
				} catch (err) {
					_didIteratorError8 = true;
					_iteratorError8 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion8 && _iterator8.return) {
							_iterator8.return();
						}
					} finally {
						if (_didIteratorError8) {
							throw _iteratorError8;
						}
					}
				}

				return target;
			},
			removeHandlers: function removeHandlers() {
				var removeHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = removeHandlerArgs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var _step9$value = _toArray(_step9.value),
						    trigger = _step9$value[0],
						    _fns2 = _step9$value.slice(1);

						target.removeHandler.apply(target, [trigger].concat(_toConsumableArray(_fns2)));
					}
				} catch (err) {
					_didIteratorError9 = true;
					_iteratorError9 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion9 && _iterator9.return) {
							_iterator9.return();
						}
					} finally {
						if (_didIteratorError9) {
							throw _iteratorError9;
						}
					}
				}

				return target;
			}
		}
	};
};

exports.default = Eventable;