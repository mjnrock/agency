"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Channel = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase2 = require("./../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

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
            config = _ref$config === undefined ? {} : _ref$config;

        _classCallCheck(this, Channel);

        var _this = _possibleConstructorReturn(this, (Channel.__proto__ || Object.getPrototypeOf(Channel)).call(this));

        _this.globals = globals;
        _this.handlers = new Map([["*", new Set()], ["**", new Set()]]);
        _this.queue = [];

        _this.config = _extends({
            isBatchProcess: false,
            maxBatchSize: 1000
        }, config);
        return _this;
    }

    /**
     * Turn off the batching process and process any event
     *  that comes through as it comes through
     */


    _createClass(Channel, [{
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
         */

    }, {
        key: "invokeHandlers",
        value: function invokeHandlers(message) {
            var optionArgs = _extends({}, this.globals, {
                channel: this
            });

            var preHandlers = this.handlers.get("*") || [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = preHandlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var pre = _step.value;

                    if (typeof pre === "function") {
                        pre(message, optionArgs);
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

            var handlers = this.handlers.get(message.type) || [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var handler = _step2.value;

                    if (typeof handler === "function") {
                        handler(message, optionArgs);
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

            var postHandlers = this.handlers.get("**") || [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = postHandlers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var post = _step3.value;

                    if (typeof post === "function") {
                        post(message, optionArgs);
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

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = fns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var fn = _step4.value;

                    if (typeof fn === "function") {
                        this.handlers.get(event).add(fn);
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

            return this;
        }
    }, {
        key: "addHandlers",
        value: function addHandlers() {
            var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = addHandlerArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _step5$value = _toArray(_step5.value),
                        event = _step5$value[0],
                        fns = _step5$value.slice(1);

                    this.addHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = fns[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var fn = _step6.value;

                        bools.push(this.handlers.get(event).delete(fn));
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
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = addHandlerArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _step7$value = _toArray(_step7.value),
                        event = _step7$value[0],
                        fns = _step7$value.slice(1);

                    this.removeHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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
    }]);

    return Channel;
}(_AgencyBase3.default);

;

exports.default = Channel;