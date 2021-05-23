"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Watchable = exports.wrapNested = exports.WatchableArchetype = exports.createMessage = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.Factory = Factory;
exports.AsyncFactory = AsyncFactory;

var _AgencyBase2 = require("./../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _helper = require("./../util/helper");

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

var _Network = require("./Network");

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createMessage = exports.createMessage = function createMessage(emitter) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(_Message2.default, [null].concat([emitter], args)))();
};

var WatchableArchetype = exports.WatchableArchetype = function (_AgencyBase) {
    _inherits(WatchableArchetype, _AgencyBase);

    function WatchableArchetype() {
        _classCallCheck(this, WatchableArchetype);

        return _possibleConstructorReturn(this, (WatchableArchetype.__proto__ || Object.getPrototypeOf(WatchableArchetype)).call(this));
    }

    return WatchableArchetype;
}(_AgencyBase3.default);

var wrapNested = exports.wrapNested = function wrapNested(controller, prop, input) {
    if (input instanceof WatchableArchetype) {
        return input;
    } else if (prop[0] === "_") {
        return input;
    } else if ((typeof input === "undefined" ? "undefined" : _typeof(input)) !== "object") {
        return input;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                var kprop = prop + "." + key;

                input[key] = wrapNested(controller, kprop, value);
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

    var proxy = new Proxy(input, {
        getPrototypeOf: function getPrototypeOf(t) {
            return WatchableArchetype.prototype;
        },
        get: function get(t, p) {
            if (controller.useControlMessages) {
                if ((Reflect.getOwnPropertyDescriptor(t, p) || {}).enumerable) {
                    controller.dispatch(Watchable.ControlType.READ, prop + "." + p);
                }
            }

            return Reflect.get(t, p);
        },
        set: function set(t, p, v) {
            var current = t[p];

            var nprop = prop + "." + p;

            if (t[p] === v) {
                // Ignore if the old value === new value
                return t;
            }

            var isNewlyCreated = current === void 0;

            if (p[0] === "_" || (Reflect.getOwnPropertyDescriptor(t, p) || {}).set) {
                return Reflect.defineProperty(t, p, {
                    value: v,
                    configurable: true,
                    writable: true,
                    enumerable: false
                });
            }

            if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                var ob = wrapNested(controller, nprop, v);

                Reflect.set(t, p, ob);
            } else {
                Reflect.set(t, p, v);
            }

            if (!(Array.isArray(input) && p in Array.prototype)) {
                // Don't broadcast native <Array> keys (i.e. .push returns .length)
                if (controller.useControlMessages) {
                    if (isNewlyCreated) {
                        controller.dispatch(Watchable.ControlType.CREATE, nprop, v);
                    } else {
                        controller.dispatch(Watchable.ControlType.UPDATE, nprop, v, current);
                    }

                    controller.dispatch(Watchable.ControlType.UPSERT, nprop, v, current);
                } else {
                    if (isNewlyCreated) {
                        controller.dispatch(nprop, v);
                    } else {
                        controller.dispatch(nprop, v, current);
                    }
                }
            }

            return t;
        },
        deleteProperty: function deleteProperty(t, p) {
            if (p in t) {
                var current = Reflect.get(t, p);
                var reflect = Reflect.deleteProperty(t, p);

                var nprop = prop + "." + p;

                if (controller.useControlMessages) {
                    controller.dispatch(Watchable.ControlType.DELETE, nprop, void 0);
                } else {
                    controller.dispatch(nprop, void 0);
                }

                target.controller.dispatch(Watchable.ControlType.UPSERT, nprop, void 0, current);

                return reflect;
            }

            return false;
        }
    });

    return proxy;
};

/**
 * The <Watchable> is an <Object> that emits changes to itself
 *  to a <Network>.  Newly added values to the <Watchable> are
 *  wrapped in a watcher for nested object changes.
 * 
 * CRUD-like messaging is available with use of the @useControlMessages
 *  flag.  A property *must be enumerable* in order for a message to fire.
 *  If @useControlMessages is *false*, then the "READ" messages are *not* fired.
 */

var Watchable = exports.Watchable = function (_WatchableArchetype) {
    _inherits(Watchable, _WatchableArchetype);

    /**
     * @isStateSchema bool | false | Function values will be evaluated at one (1) level of depth [ i.e. (f => g => {})(this, key, value) --> g => {} ]
     * @emitProtected bool | false | Emit updates for props like `_%` (i.e. one (1) preceding underscore)
     * @emitPrivate bool | false | Emit updates for props like `__%` (i.e. two (2) preceding underscores)
     * @useControlMessages bool | false | Use << Watchable.ControlType >> for CRUD-like messaging from the <Watchable>.  These can be used for event-listening for data syncing.
     */
    function Watchable() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ret;

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$hooks = _ref.hooks,
            hooks = _ref$hooks === undefined ? {} : _ref$hooks,
            network = _ref.network,
            _ref$isStateSchema = _ref.isStateSchema,
            isStateSchema = _ref$isStateSchema === undefined ? false : _ref$isStateSchema,
            _ref$emitProtected = _ref.emitProtected,
            emitProtected = _ref$emitProtected === undefined ? false : _ref$emitProtected,
            _ref$emitPrivate = _ref.emitPrivate,
            emitPrivate = _ref$emitPrivate === undefined ? false : _ref$emitPrivate,
            _ref$useControlMessag = _ref.useControlMessages,
            useControlMessages = _ref$useControlMessag === undefined ? false : _ref$useControlMessag;

        _classCallCheck(this, Watchable);

        var _this2 = _possibleConstructorReturn(this, (Watchable.__proto__ || Object.getPrototypeOf(Watchable)).call(this));

        _this2.__channel = new _Channel2.default({ handlers: _extends({
                "**": function _(msg) {
                    if (_this2.__controller.network) {
                        _this2.__controller.network.dispatch(msg);
                    }
                }
            }, hooks) });
        _this2.__controller = {
            network: null,
            dispatch: function dispatch() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return _this2.__channel.bus(createMessage.apply(undefined, [_this2].concat(args)));
            },
            useControlMessages: useControlMessages
        };

        _this2.$attach(network);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.entries(state)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    key = _step2$value[0],
                    value = _step2$value[1];

                var newValue = void 0;
                if (isStateSchema && typeof value === "function") {
                    newValue = value(_this2, key, value);
                } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    newValue = wrapNested(_this2.__controller, key, value);
                } else {
                    newValue = value;
                }

                Reflect.set(_this2, key, newValue);
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

        var proxy = new Proxy(_this2, {
            get: function get(target, prop) {
                if ((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    var props = prop.split(".");

                    if (props[0] === "$") {
                        props = props.slice(1);
                    }

                    var result = target;
                    var i = 0;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var p = _step3.value;

                            if ((typeof result === "undefined" ? "undefined" : _typeof(result)) === "object") {
                                if (target.__controller.useControlMessages) {
                                    if (i === 0 && (Reflect.getOwnPropertyDescriptor(target, prop) || {}).enumerable) {
                                        target.__controller.dispatch(Watchable.ControlType.READ, p);
                                    }
                                }
                                var next = Reflect.get(result, p);

                                if (next !== void 0) {
                                    result = next;
                                }
                            } else {
                                return void 0; // Selection does not exist
                            }

                            ++i;
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

                    if (result !== target) {
                        return result;
                    } else {
                        return;
                    }
                }

                if (target.__controller.useControlMessages) {
                    if ((Reflect.getOwnPropertyDescriptor(target, prop) || {}).enumerable) {
                        target.__controller.dispatch(Watchable.ControlType.READ, prop);
                    }
                }

                return Reflect.get(target, prop);
            },
            set: function set(target, prop, value) {
                var current = target[prop];

                if (prop === "$set" && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = Object.keys(target)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var k = _step4.value;

                            delete target[k];
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

                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = Object.entries(value)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _step5$value = _slicedToArray(_step5.value, 2),
                                _k = _step5$value[0],
                                v = _step5$value[1];

                            target[_k] = v;
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
                }

                if (current === value) {
                    return target;
                } else if (prop[0] === "_") {
                    if (emitProtected !== true) {
                        return Reflect.set(target, prop, value);
                    } else if (prop[1] === "_") {
                        if (emitPrivate !== true) {
                            return Reflect.set(target, prop, value);
                        }
                    }
                }

                var newValue = void 0;
                if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    newValue = wrapNested(target.__controller, prop, value);
                } else {
                    newValue = value;
                }

                var isNewlyCreated = current === void 0;
                var reflect = Reflect.set(target, prop, newValue);

                if (target.__controller.useControlMessages) {
                    if (isNewlyCreated) {
                        target.__controller.dispatch(Watchable.ControlType.CREATE, prop, newValue);
                    } else {
                        target.__controller.dispatch(Watchable.ControlType.UPDATE, prop, newValue, current);
                    }

                    target.__controller.dispatch(Watchable.ControlType.UPSERT, prop, newValue, current);
                } else {
                    if (isNewlyCreated) {
                        target.__controller.dispatch(prop, newValue);
                    } else {
                        target.__controller.dispatch(prop, newValue, current);
                    }
                }

                return reflect;
            },
            deleteProperty: function deleteProperty(target, prop) {
                var current = Reflect.get(target, prop);
                var reflect = Reflect.deleteProperty(target, prop);

                if (target.__controller.useControlMessages) {
                    target.__controller.dispatch(Watchable.ControlType.DELETE, prop, void 0);
                } else {
                    target.__controller.dispatch(prop, void 0);
                }

                target.__controller.dispatch(Watchable.ControlType.UPSERT, prop, void 0, current);

                return reflect;
            }
        });

        return _ret = proxy, _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(Watchable, [{
        key: "$attach",
        value: function $attach(network) {
            if (network instanceof _Network2.default) {
                this.$detach();

                this.__controller.network = network.addListener(this);
            }

            return this;
        }
    }, {
        key: "$detach",
        value: function $detach() {
            if (this.__controller.network) {
                this.__controller.network.leave();
                this.__controller.network = null;
            }

            return this;
        }

        /**
         * Arguments are passed directly to << .toString >>
         * Final buffer has the following concatenation:
         * [ primaryLength ][ primaryChar(s) ][ secondaryLength ][ secondaryChar(s) ][ << this.toString(...args) >> ]
         * 
         * E.g. primary="|",secondary=":",this={ test: true } --> `1|1:test:true`
         * E.g. both=".",this={ test: true, another: "yes" } --> `1.1.test.true.another.yes`
         */

    }, {
        key: "toBuffer",
        value: function toBuffer() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref2$primary = _ref2.primary,
                primary = _ref2$primary === undefined ? "|" : _ref2$primary,
                _ref2$secondary = _ref2.secondary,
                secondary = _ref2$secondary === undefined ? ":" : _ref2$secondary,
                all = _ref2.all;

            var str = this.toString({ primary: primary, secondary: secondary, all: all });
            var buffer = Buffer.from("" + primary.length + primary + secondary.length + secondary + str);

            return buffer;
        }
    }, {
        key: "toString",
        value: function toString() {
            var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref3$primary = _ref3.primary,
                primary = _ref3$primary === undefined ? "|" : _ref3$primary,
                _ref3$secondary = _ref3.secondary,
                secondary = _ref3$secondary === undefined ? ":" : _ref3$secondary,
                all = _ref3.all;

            if (all) {
                primary = secondary = all.toString();
            }

            return (0, _helper.flatten)(this, { asArray: true }).map(function (_ref4) {
                var _ref5 = _slicedToArray(_ref4, 2),
                    k = _ref5[0],
                    v = _ref5[1];

                return "" + k + secondary + v;
            }).join(primary);
        }
    }, {
        key: "toObject",
        value: function toObject() {
            var includeCustomFns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (includeCustomFns) {
                return Object.assign({}, this);
            }

            var obj = Object.assign({}, this);
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = Object.keys(obj)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var key = _step6.value;

                    if (typeof obj[key] === "function") {
                        delete obj[key];
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

            return obj;
        }
    }, {
        key: "toSchemaObject",
        value: function toSchemaObject() {
            var obj = this.toObject(true);

            return (0, _helper.recurse)(obj, {
                setter: function setter(key, value) {
                    return {
                        type: typeof value === "undefined" ? "undefined" : _typeof(value),
                        value: value
                    };
                }
            });
        }
    }, {
        key: "toJson",
        value: function toJson() {
            var _this3 = this;

            var includeCustomFns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            return JSON.stringify(this.toObject(includeCustomFns), function (key, value) {
                if (typeof value === "function") {
                    return value.toString();
                } else if (value === _this3) {
                    return WatchableArchetype;
                }

                return value;
            });
        }
    }, {
        key: "isAttached",
        get: function get() {
            return !!this.__controller.network;
        }
    }], [{
        key: "Flatten",
        value: function Flatten(watchable) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return (0, _helper.flatten)(watchable, opts);
        }
    }, {
        key: "Unflatten",
        value: function Unflatten(obj) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var unflattenOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return new Watchable((0, _helper.unflatten)(obj, unflattenOpts), opts);
        }
    }, {
        key: "Generate",
        value: function Generate(watchable) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (watchable instanceof Watchable) {
                return new Watchable(watchable.toObject(opts.includeCustomFns), opts);
            } else if (!Array.isArray(watchable) && (typeof watchable === "undefined" ? "undefined" : _typeof(watchable)) === "object") {
                return new Watchable(watchable, opts);
            }

            return false;
        }
    }]);

    return Watchable;
}(WatchableArchetype);

Watchable.ControlType = {
    CREATE: "Watchable:Create",
    READ: "Watchable:Read",
    UPDATE: "Watchable:Update",
    DELETE: "Watchable:Delete",

    UPSERT: "Watchable:Upsert" // This will fire under CREATE, UPDATE, and DELETE messages
};
Watchable.Factory = Factory;
Watchable.AsyncFactory = AsyncFactory;
;

/**
 * @qty may be a number or a fn(args)
 * @args may be direct arguments or a fn(i) to determine appropriate arguments for that iteration
 * Returns one (1) <Watchable> if @qty === 1 and [ ...<Watchable> ] if @qty > 1
 * 
 * @metaFactory can be set to << true|"async" >> to instead receive a "default args" version of << Factory|AsyncFactory >>
 *  that will use all passed arguments as the defaults.  The async version of this
 *  can also return a factory, but it is also exposed here so that the meta factory method is not a <Promise>.
 */
function Factory() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var qty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var metaFactory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (typeof qty === "function") {
        qty = qty(args);
    }

    var results = [];
    for (var i = 0; i < qty; i++) {
        var localArgs = void 0;
        if (typeof args === "function") {
            localArgs = args(i);
        } else {
            if (Array.isArray(args)) {
                localArgs = args;
            } else {
                localArgs = [args];
            }
        }

        var watch = new (Function.prototype.bind.apply(Watchable, [null].concat(_toConsumableArray(localArgs))))();

        results.push(watch);
    }

    if (metaFactory === true || metaFactory === "sync") {
        return function (localArgs, localQty) {
            localArgs = localArgs == null ? args : localArgs;
            localQty = localQty == null ? qty : localQty;

            return Factory(localArgs, localQty, false);
        };
    } else if (metaFactory === "async") {
        return async function (localArgs, localQty) {
            localArgs = localArgs == null ? args : localArgs;
            localQty = localQty == null ? qty : localQty;

            return await AsyncFactory(localArgs, localQty, false);
        };
    }

    if (results.length > 1) {
        return results;
    }

    return results[0];
};

/**
 * Identical to << Factory >>, except that functions can be
 *  async functions.  This returns a resolved <Promise> with
 *  the final <Watchable> value(s).
 * 
 * @metaFactory can be set to << true >> to instead receive a "default args" version of << Factory >>
 *  that will use all passed arguments as the defaults.
 */
async function AsyncFactory() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var qty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var metaFactory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (typeof qty === "function") {
        qty = await qty(args);
    }

    var results = [];
    for (var i = 0; i < qty; i++) {
        var localArgs = void 0;
        if (typeof args === "function") {
            localArgs = await args(i);
        } else {
            if (Array.isArray(args)) {
                localArgs = args;
            } else {
                localArgs = [args];
            }
        }

        var watch = new (Function.prototype.bind.apply(Watchable, [null].concat(_toConsumableArray(localArgs))))();

        results.push(watch);
    }

    if (metaFactory) {
        return async function (localArgs, localQty) {
            localArgs = localArgs == null ? args : localArgs;
            localQty = localQty == null ? qty : localQty;

            return await AsyncFactory(localArgs, localQty, false);
        };
    }

    if (results.length > 1) {
        return Promise.resolve(results);
    }

    return Promise.resolve(results[0]);
};

exports.default = Watchable;