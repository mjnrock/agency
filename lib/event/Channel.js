"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Channel = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase2 = require("./../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = exports.Channel = function (_AgencyBase) {
    _inherits(Channel, _AgencyBase);

    function Channel() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$globals = _ref.globals,
            globals = _ref$globals === undefined ? {} : _ref$globals,
            _ref$config = _ref.config,
            config = _ref$config === undefined ? {} : _ref$config,
            _ref$handlers = _ref.handlers,
            handlers = _ref$handlers === undefined ? {} : _ref$handlers;

        _classCallCheck(this, Channel);

        var _this = _possibleConstructorReturn(this, (Channel.__proto__ || Object.getPrototypeOf(Channel)).call(this));

        _this.globals = globals;
        _this.handlers = new Map([["*", new Set()], ["**", new Set()]]);
        _this.queue = [];

        _this.parseHandlerObject(handlers);

        _this.config = _extends({
            isBatchProcess: false,
            maxBatchSize: 1000
        }, config);
        return _this;
    }

    _createClass(Channel, [{
        key: "parseHandlerObject",
        value: function parseHandlerObject(handlers) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(handlers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    if (key === "$globals") {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = Object.entries(value)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _step2$value = _slicedToArray(_step2.value, 2),
                                    k = _step2$value[0],
                                    v = _step2$value[1];

                                this.globals[k] = v;
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
                    } else if (key === "$reducers") {
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = Object.entries(value)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _step3$value = _slicedToArray(_step3.value, 2),
                                    k = _step3$value[0],
                                    v = _step3$value[1];

                                if (!Array.isArray(v)) {
                                    v = [v];
                                }

                                this.addReducer.apply(this, [k].concat(_toConsumableArray(v)));
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
                    } else if (key === "$mergeReducers") {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = Object.entries(value)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var _step4$value = _slicedToArray(_step4.value, 2),
                                    k = _step4$value[0],
                                    v = _step4$value[1];

                                if (!Array.isArray(v)) {
                                    v = [v];
                                }

                                this.addMergeReducer.apply(this, [k].concat(_toConsumableArray(v)));
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
                    } else if (key === "$effects") {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = Object.entries(value)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _step5$value = _slicedToArray(_step5.value, 2),
                                    k = _step5$value[0],
                                    v = _step5$value[1];

                                if (!Array.isArray(v)) {
                                    v = [v];
                                }

                                this.addEffect.apply(this, [k].concat(_toConsumableArray(v)));
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
                    } else {
                        if (!Array.isArray(value)) {
                            value = [value];
                        }

                        this.addHandler.apply(this, [key].concat(_toConsumableArray(value)));
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
        }

        /**
         * Turn off the batching process and process any event
         *  that comes through as it comes through
         */

    }, {
        key: "useRealTimeProcess",
        value: function useRealTimeProcess() {
            this.config.isBatchProcess = false;
        }
        /**
         * Queue *all* events that get captured and store them in
         *  the queue until << .process() >> is invoked up to the
         *  << this.config.maxBatchSize >>.
         */

    }, {
        key: "useBatchProcess",
        value: function useBatchProcess() {
            this.config.isBatchProcess = true;
        }
    }, {
        key: "setBatchSize",
        value: function setBatchSize() {
            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

            this.config.maxBatchSize = size;
        }
    }, {
        key: "enqueue",
        value: function enqueue() {
            var _queue;

            (_queue = this.queue).push.apply(_queue, arguments);

            return this;
        }
    }, {
        key: "dequeue",
        value: function dequeue() {
            if (this.queue.length) {
                return this.queue.shift();
            }
        }
    }, {
        key: "empty",
        value: function empty() {
            this.queue = [];

            return this;
        }
    }, {
        key: "bus",
        value: function bus(message) {
            if (this.config.isBatchProcess) {
                return this.enqueue(message);
            }

            return this.invokeHandlers(message);
        }
    }, {
        key: "process",
        value: function process() {
            var i = 0;
            while (!this.isEmpty && i < this.config.maxBatchSize) {
                var message = this.dequeue();

                this.invokeHandlers(message);
                ++i;
            }

            return this;
        }

        /**
         * An extracted invocation method so that << .bus >> can
         *  bypass the queue if in real-time mode.
        * 
        * NOTE: If a "*" handler returns << false >>, the *entire*
        * 	invocation will halt and return << false >> and no further
        * 	handlers will fire.  As such, this allows "*" to be used 
        * 	as a de facto <Channel> filter.
         */

    }, {
        key: "invokeHandlers",
        value: function invokeHandlers(message) {
            var optionArgs = _extends({}, this.globals, {
                channel: this
            });

            var preHandlers = this.handlers.get("*") || [];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = preHandlers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var pre = _step6.value;

                    if (typeof pre === "function") {
                        var result = pre(message, optionArgs);

                        // Pre-check escape activation
                        if (result === false) {
                            return false;
                        }
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

            var handlers = this.handlers.get(message.type) || [];
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = handlers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var handler = _step7.value;

                    if (typeof handler === "function") {
                        handler(message, optionArgs);
                    }
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

            var postHandlers = this.handlers.get("**") || [];
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = postHandlers[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var post = _step8.value;

                    if (typeof post === "function") {
                        post(message, optionArgs);
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

            return this;
        }
    }, {
        key: "addHandler",
        value: function addHandler(event) {
            for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                fns[_key - 1] = arguments[_key];
            }

            if (!(this.handlers.get(event) instanceof Set)) {
                this.handlers.set(event, new Set());
            }

            if (Array.isArray(fns[0])) {
                fns = fns[0];
            }

            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = fns[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var fn = _step9.value;

                    if (typeof fn === "function") {
                        this.handlers.get(event).add(fn);
                    }
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

            return this;
        }
    }, {
        key: "addHandlers",
        value: function addHandlers() {
            var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = addHandlerArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var _step10$value = _toArray(_step10.value),
                        event = _step10$value[0],
                        fns = _step10$value.slice(1);

                    this.addHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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

            return this;
        }
    }, {
        key: "removeHandler",
        value: function removeHandler(event) {
            for (var _len2 = arguments.length, fns = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                fns[_key2 - 1] = arguments[_key2];
            }

            if (this.handlers.get(event) instanceof Set) {
                if (Array.isArray(fns[0])) {
                    fns = fns[0];
                }

                var bools = [];
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = fns[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var fn = _step11.value;

                        bools.push(this.handlers.get(event).delete(fn));
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

                if (bools.length === 1) {
                    return bools[0];
                }

                return bools;
            }

            return false;
        }
    }, {
        key: "removeHandlers",
        value: function removeHandlers() {
            var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = addHandlerArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var _step12$value = _toArray(_step12.value),
                        event = _step12$value[0],
                        fns = _step12$value.slice(1);

                    this.removeHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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

            return this;
        }
    }, {
        key: "addReducer",
        value: function addReducer(event) {
            for (var _len3 = arguments.length, fns = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                fns[_key3 - 1] = arguments[_key3];
            }

            var newFns = fns.map(function (fn) {
                return function (msg, _ref2) {
                    for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                        args[_key4 - 2] = arguments[_key4];
                    }

                    var setState = _ref2.setState,
                        getState = _ref2.getState,
                        rest = _objectWithoutProperties(_ref2, ["setState", "getState"]);

                    setState(fn.apply(undefined, [msg, _extends({ setState: setState, state: getState() }, rest)].concat(args)));
                };
            });

            this.addHandler.apply(this, [event].concat(_toConsumableArray(newFns)));

            return [event, newFns];
        }
    }, {
        key: "addMergeReducer",
        value: function addMergeReducer(event) {
            for (var _len5 = arguments.length, fns = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                fns[_key5 - 1] = arguments[_key5];
            }

            var newFns = fns.map(function (fn) {
                return function (msg, _ref3) {
                    for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                        args[_key6 - 2] = arguments[_key6];
                    }

                    var mergeState = _ref3.mergeState,
                        getState = _ref3.getState,
                        rest = _objectWithoutProperties(_ref3, ["mergeState", "getState"]);

                    mergeState(fn.apply(undefined, [msg, _extends({ mergeState: mergeState, state: getState() }, rest)].concat(args)));
                };
            });

            this.addHandler.apply(this, [event].concat(_toConsumableArray(newFns)));

            return [event, newFns];
        }
    }, {
        key: "addReducers",
        value: function addReducers() {
            var addReducerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var newFns = [];
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = addReducerArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var _step13$value = _toArray(_step13.value),
                        event = _step13$value[0],
                        _fns = _step13$value.slice(1);

                    newFns.push(this.addReducer.apply(this, [event].concat(_toConsumableArray(_fns))));
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

            return newFns;
        }
    }, {
        key: "addMergeReducers",
        value: function addMergeReducers() {
            var addMergeReducerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var newFns = [];
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = addMergeReducerArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var _step14$value = _toArray(_step14.value),
                        event = _step14$value[0],
                        _fns2 = _step14$value.slice(1);

                    newFns.push(this.addMergeReducer.apply(this, [event].concat(_toConsumableArray(_fns2))));
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

            return newFns;
        }
    }, {
        key: "addEffect",


        /**
         * Effects are fired *after* a single *message* has been handled.
         * 	As such, effects will fire **once per message** when dealing with
         * 	<MessageCollections> (i.e. << messages.size >> times).
         */
        value: function addEffect(event) {
            for (var _len7 = arguments.length, fns = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                fns[_key7 - 1] = arguments[_key7];
            }

            var newFn = function newFn(msg) {
                for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
                    args[_key8 - 1] = arguments[_key8];
                }

                if (msg.type === event) {
                    var _iteratorNormalCompletion15 = true;
                    var _didIteratorError15 = false;
                    var _iteratorError15 = undefined;

                    try {
                        for (var _iterator15 = fns[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                            var fn = _step15.value;

                            fn.apply(undefined, [msg].concat(args));
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
                }
            };

            this.addHandler("**", newFn);

            return [event, newFn];
        }
    }, {
        key: "addEffects",
        value: function addEffects() {
            var addEffectArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var newFns = [];
            var _iteratorNormalCompletion16 = true;
            var _didIteratorError16 = false;
            var _iteratorError16 = undefined;

            try {
                for (var _iterator16 = addEffectArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                    var _step16$value = _toArray(_step16.value),
                        event = _step16$value[0],
                        _fns3 = _step16$value.slice(1);

                    newFns.push(this.addEffect.apply(this, [event].concat(_toConsumableArray(_fns3))));
                }
            } catch (err) {
                _didIteratorError16 = true;
                _iteratorError16 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion16 && _iterator16.return) {
                        _iterator16.return();
                    }
                } finally {
                    if (_didIteratorError16) {
                        throw _iteratorError16;
                    }
                }
            }

            return newFns;
        }

        /**
         * This is similar to .addHandlers, but will erase any existing handlers, first.
         */

    }, {
        key: "reassignHandlers",
        value: function reassignHandlers() {
            var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this.handlers = new Map([["*", new Set()]]);

            this.addHandlers(addHandlerArgs);

            return this;
        }
    }, {
        key: "isEmpty",
        get: function get() {
            return !this.queue.length;
        }
    }, {
        key: "removeReducer",
        get: function get() {
            return this.removeHandler;
        }
    }, {
        key: "removeReducers",
        get: function get() {
            return this.removeHandlers;
        }
    }, {
        key: "removeMergeReducer",
        get: function get() {
            return this.removeHandler;
        }
    }, {
        key: "removeMergeReducers",
        get: function get() {
            return this.removeHandlers;
        }
    }, {
        key: "removeEffect",
        get: function get() {
            return this.removeHandler;
        }
    }, {
        key: "removeEffects",
        get: function get() {
            return this.removeHandlers;
        }
    }]);

    return Channel;
}(_AgencyBase3.default);

;

exports.default = Channel;