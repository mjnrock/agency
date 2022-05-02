"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Agent = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _Message = require("./comm/Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Agent = exports.Agent = function () {
	function Agent() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$state = _ref.state,
		    state = _ref$state === undefined ? {} : _ref$state,
		    _ref$triggers = _ref.triggers,
		    triggers = _ref$triggers === undefined ? [] : _ref$triggers,
		    config = _ref.config,
		    namespace = _ref.namespace,
		    id = _ref.id,
		    _ref$globals = _ref.globals,
		    globals = _ref$globals === undefined ? {} : _ref$globals,
		    _ref$hooks = _ref.hooks,
		    hooks = _ref$hooks === undefined ? {} : _ref$hooks;

		_classCallCheck(this, Agent);

		this.id = id || (0, _uuid.v4)();
		this.state = state;
		this.triggers = new Map(triggers);
		this.config = _extends({
			//* Agent config
			//? These are proxy hooks that affect how the Agent behaves, in general (e.g. Accessor hook to return value from an API)
			hooks: _extends({
				get: new Set(), // Accessor hook
				pre: new Set(), // Pre-set hook
				post: new Set(), // Post-set hook
				delete: new Set() }, hooks),

			//*	Reducer config
			isReducer: true, // Make ALL triggers return a state -- to exclude a trigger from state, create a * handler that returns true on those triggers
			allowRPC: true, // If no trigger handlers exist AND an internal method is named equal to the trigger, pass ...args to that method

			//* Batching config
			queue: new Set(),
			isBatchProcessing: false,
			maxBatchSize: 1000,

			//* Trigger config
			namespace: namespace,
			notifyTrigger: "@update",
			dispatchTrigger: "@dispatch",

			//* Global context object
			//? These will be added to all @payloads
			globals: _extends({}, globals)

		}, config);

		return new Proxy(this, {
			get: function get(target, prop) {
				var value = Reflect.get(target, prop);
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = target.config.hooks.get[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var fn = _step.value;

						value = fn(target, prop, value);

						// Short-circuit execution and return substitute value
						if (value !== void 0) {
							return value;
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

				return value;
			},
			set: function set(target, prop, value) {
				var newValue = value;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = target.config.hooks.pre[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var fn = _step2.value;

						newValue = fn(target, prop, value);

						if (newValue === Agent.Hooks.Abort) {
							return Agent.Hooks.Abort;
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

				var returnVal = Reflect.set(target, prop, newValue);

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = target.config.hooks.post[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var _fn = _step3.value;

						newValue = _fn(target, prop, value);
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

				return returnVal;
			},
			deleteProperty: function deleteProperty(target, prop) {
				var shouldDelete = true;
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = target.config.hooks.delete[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var fn = _step4.value;

						shouldDelete = fn(target, prop, shouldDelete);

						if (shouldDelete === Agent.Hooks.Abort) {
							return Agent.Hooks.Abort;
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

				if (!!shouldDelete) {
					return Reflect.deleteProperty(target, prop);
				}

				return false;
			}
		});
	}
	//? Allow for universal values to invoke short-circuits in the proxy traps (e.g. prevent update, change accessor return value, etc.)


	_createClass(Agent, [{
		key: "deconstructor",
		value: function deconstructor() {}

		/**
   * Convenience function for toggling/altering configuration booleans -- must be a boolean
   */

	}, {
		key: "toggle",
		value: function toggle(configAttribute, newValue) {
			if (typeof this.config[configAttribute] === "boolean") {
				if (typeof newValue === "boolean") {
					this.config[configAttribute] = newValue;
				} else {
					this.config[configAttribute] = !this.config[configAttribute];
				}
			}

			return this;
		}
	}, {
		key: "assert",
		value: function assert(configAttribute, expectedValue) {
			return this.config[configAttribute] === expectedValue;
		}

		/**
   * @trigger can be anything, not limited to strings
   */

	}, {
		key: "addTrigger",
		value: function addTrigger(trigger) {
			var handlers = this.triggers.get(trigger) || new Set();

			for (var _len = arguments.length, handler = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				handler[_key - 1] = arguments[_key];
			}

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = handler[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var fn = _step5.value;

					if (typeof fn === "function") {
						handlers.add(fn);
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

			this.triggers.set(trigger, handlers);

			return this;
		}
	}, {
		key: "addTriggers",
		value: function addTriggers() {
			var addTriggerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			if ((typeof addTriggerArgs === "undefined" ? "undefined" : _typeof(addTriggerArgs)) === "object") {
				if (Array.isArray(addTriggerArgs)) {
					var _iteratorNormalCompletion6 = true;
					var _didIteratorError6 = false;
					var _iteratorError6 = undefined;

					try {
						for (var _iterator6 = addTriggerArgs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
							var args = _step6.value;

							this.addTrigger.apply(this, _toConsumableArray(args));
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
				} else {
					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = Object.entries(addTriggerArgs)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var _step7$value = _slicedToArray(_step7.value, 2),
							    key = _step7$value[0],
							    fn = _step7$value[1];

							this.addTrigger(key, fn);
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
				}
			}

			return this;
		}
	}, {
		key: "removeTrigger",
		value: function removeTrigger(trigger) {
			var handlers = this.triggers.get(trigger);

			for (var _len2 = arguments.length, handler = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				handler[_key2 - 1] = arguments[_key2];
			}

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = handler[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var fn = _step8.value;

					if (handlers instanceof Set) {
						return handlers.delete(fn);
					}
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

			return false;
		}
	}, {
		key: "removeTriggers",
		value: function removeTriggers() {
			var removeTriggerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			var results = [];
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = removeTriggerArgs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var args = _step9.value;

					results.push(this.removeTrigger.apply(this, _toConsumableArray(args)));
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

			return results;
		}
	}, {
		key: "hasTrigger",
		value: function hasTrigger(trigger) {
			return this.triggers.has(trigger);
		}

		/**
   * 
   */

	}, {
		key: "__generatePayload",
		value: function __generatePayload() {
			var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    id = _ref2.id,
			    trigger = _ref2.trigger,
			    args = _ref2.args;

			return [args, _extends({
				namespace: this.config.namespace,
				trigger: trigger,
				target: this,
				state: this.state,
				invoke: this.invoke,
				_id: id

			}, this.config.globals)];
		}

		/**
   * This should NOT be used externally.
   * 
   * A handling abstract to more easily deal with
   * batching vs immediate invocations
   */

	}, {
		key: "__handleInvocation",
		value: function __handleInvocation(trigger) {
			for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				args[_key3 - 1] = arguments[_key3];
			}

			// Prevent directly invoking specialty hooks
			if (typeof trigger === "string" && trigger[0] === "$") {
				return false;
			}

			// Many contingent handlers receive the same payload, so abstract it here
			var payload = this.__generatePayload({ id: (0, _uuid.v4)(), trigger: trigger, args: args });
			/**
    * ? Params hooks
    * These will change the data/@arguments contained in the @payload.  Use these
    * if you want to dynamically alter: @trigger, @args, or @payload.
    * 
    * NOTE: "Spoofing" is intentionally allowed -- apply necessary business logic
    * NOTE: This does NOT spread the payload -- it takes and returns a direct payload
    */
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = (this.triggers.get("$params") || [])[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var fn = _step10.value;

					payload = fn(payload);
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}

			var handlers = this.triggers.get(trigger);
			if (trigger === this.config.notifyTrigger) {
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = handlers[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var _handler = _step11.value;

						_handler.apply(undefined, _toConsumableArray(payload));
					}
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}

				return true;
			} else if (handlers.size === 0) {
				// Verify that the RPC has a landing method
				if (this.config.allowRPC === true && typeof trigger === "string" && typeof this[trigger] === "function") {
					this[trigger].apply(this, args);

					return true;
				}

				return false;
			}

			/**
    * ? Pre hooks
    * These act as filters iff one returns << true >> and will cease execution immediately (i.e. no handlers or effects will be processed)
    */
			var _iteratorNormalCompletion12 = true;
			var _didIteratorError12 = false;
			var _iteratorError12 = undefined;

			try {
				for (var _iterator12 = (this.triggers.get("$pre") || [])[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
					var _fn2 = _step12.value;

					var result = _fn2.apply(undefined, _toConsumableArray(payload));

					if (result === true) {
						return false;
					}
				}
			} catch (err) {
				_didIteratorError12 = true;
				_iteratorError12 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion12 && _iterator12.return) {
						_iterator12.return();
					}
				} finally {
					if (_didIteratorError12) {
						throw _iteratorError12;
					}
				}
			}

			var invocationType = void 0;
			if (this.config.isReducer === true) {
				invocationType = this.config.notifyTrigger;

				var next = this.state;
				var _iteratorNormalCompletion13 = true;
				var _didIteratorError13 = false;
				var _iteratorError13 = undefined;

				try {
					for (var _iterator13 = handlers[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
						var _handler2 = _step13.value;

						var last = next;

						next = _handler2(payload[0], _extends({
							state: next
						}, payload[1]));

						if (next === void 0) {
							next = last;
						}
					}
				} catch (err) {
					_didIteratorError13 = true;
					_iteratorError13 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion13 && _iterator13.return) {
							_iterator13.return();
						}
					} finally {
						if (_didIteratorError13) {
							throw _iteratorError13;
						}
					}
				}

				var oldState = this.state;
				this.state = next;

				if (Object.keys(this.state).length && oldState !== this.state) {
					this.invoke(invocationType, { current: next, previous: oldState });
				}
			} else {
				invocationType = this.config.dispatchTrigger;

				var _iteratorNormalCompletion14 = true;
				var _didIteratorError14 = false;
				var _iteratorError14 = undefined;

				try {
					for (var _iterator14 = handlers[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
						var _handler3 = _step14.value;

						_handler3.apply(undefined, _toConsumableArray(payload));
					}
				} catch (err) {
					_didIteratorError14 = true;
					_iteratorError14 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion14 && _iterator14.return) {
							_iterator14.return();
						}
					} finally {
						if (_didIteratorError14) {
							throw _iteratorError14;
						}
					}
				}

				this.invoke(invocationType, { current: this.state });
			}

			/**
    * ? Post hooks
    * Treat these like Effects
    */
			var _iteratorNormalCompletion15 = true;
			var _didIteratorError15 = false;
			var _iteratorError15 = undefined;

			try {
				for (var _iterator15 = (this.triggers.get("$post") || [])[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
					var _fn3 = _step15.value;

					_fn3.apply(undefined, [invocationType].concat(_toConsumableArray(payload)));
				}
			} catch (err) {
				_didIteratorError15 = true;
				_iteratorError15 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion15 && _iterator15.return) {
						_iterator15.return();
					}
				} finally {
					if (_didIteratorError15) {
						throw _iteratorError15;
					}
				}
			}

			return true;
		}
	}, {
		key: "__handleMessage",
		value: function __handleMessage(msg) {
			var _ref3 = [].concat(_toConsumableArray(msg.tags)),
			    trigger = _ref3[0];

			var lockedMessage = msg.copy(true);

			lockedMessage.config.isLocked = true;

			return this.__handleInvocation(trigger, lockedMessage);
		}

		/**
   * If in batch mode, add trigger to queue; else,
   * handle the invocation immediately.
   * 
   * This is overloaded by either passing a Signal
   * directly, or by passing the trigger type and
   * data args and a Signal will be created
   */

	}, {
		key: "invoke",
		value: function invoke(trigger) {
			if (trigger instanceof _Message2.default) {
				var msg = trigger;

				if (this.config.isBatchProcessing === true) {
					this.config.queue.add(msg);

					return true;
				} else {
					return this.__handleMessage(msg);
				}
			}

			/**
    * Short-circuit the invocation if the trigger has not been loaded
    */
			if (!this.triggers.has(trigger)) {
				return false;
			}

			for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				args[_key4 - 1] = arguments[_key4];
			}

			if (this.config.isBatchProcessing === true) {
				this.config.queue.add([trigger].concat(args));

				return true;
			} else {
				return this.__handleInvocation.apply(this, [trigger].concat(args));
			}
		}

		/**
   * Process @qty amount of queued triggers
   */

	}, {
		key: "process",
		value: function process() {
			var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.maxBatchSize;

			if (this.config.isBatchProcessing !== true) {
				return [];
			}

			var queue = [].concat(_toConsumableArray(this.config.queue));
			var results = [];
			var runSize = Math.min(qty, this.config.maxBatchSize);

			for (var i = 0; i < runSize; i++) {
				var _queue$i = _toArray(queue[i]),
				    trigger = _queue$i[0],
				    _args = _queue$i.slice(1);

				var result = this.__handleInvocation.apply(this, [trigger].concat(_toConsumableArray(_args)));

				results.push(result);
			}

			this.config.queue = new Set(queue.slice(runSize));

			return results;
		}
	}, {
		key: "asyncInvoke",
		value: async function asyncInvoke(trigger) {
			for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
				args[_key5 - 1] = arguments[_key5];
			}

			return await Promise.resolve(this.invoke.apply(this, [trigger].concat(args)));
		}
	}, {
		key: "asyncProcess",
		value: async function asyncProcess() {
			var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.maxBatchSize;

			return await Promise.resolve(this.process(qty));
		}
	}], [{
		key: "Create",
		value: function Create() {
			var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return new this(obj);
		}
	}, {
		key: "Factory",
		value: function Factory() {
			var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
			var fnOrObj = arguments[1];

			// Single-parameter override for .Spawning one (1) this
			if (typeof qty === "function" || (typeof qty === "undefined" ? "undefined" : _typeof(qty)) === "object") {
				fnOrObj = qty;
				qty = 1;
			}

			var hbases = [];
			for (var i = 0; i < qty; i++) {
				var hbase = this.Create(typeof fnOrObj === "function" ? fnOrObj(i, qty) : fnOrObj);

				hbases.push(hbase);
			}

			if (qty === 1) {
				return hbases[0];
			}

			return hbases;
		}
	}]);

	return Agent;
}();

Agent.Hooks = {
	Abort: "74c80a9c-46c5-49c3-9c9b-2946885ee733" // If set hook returns this, prevent the update
};
;

exports.default = Agent;