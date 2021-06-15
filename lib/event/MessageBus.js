"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageBus = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Registry = require("./../Registry");

var _Registry2 = _interopRequireDefault(_Registry);

var _Router = require("./Router");

var _Router2 = _interopRequireDefault(_Router);

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageBus = exports.MessageBus = function () {
    function MessageBus() {
        var channels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            middleware = _ref.middleware;

        _classCallCheck(this, MessageBus);

        this.channels = new _Registry2.default();
        this.router = new _Router2.default(this, {
            routes: routes
        });

        this.config = {
            isBatchProcess: false,
            middleware: middleware
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var arg = _step.value;

                if (arg instanceof _Channel2.default) {
                    this.channels.register(arg);
                } else {
                    var chnl = Array.isArray(arg) ? arg : [arg];
                    this.createChannel.apply(this, _toConsumableArray(chnl));
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
     *  that comes through as it comes through for *all*
     *  <Channel(s)>, including future additions.
     */


    _createClass(MessageBus, [{
        key: "useRealTimeProcess",
        value: function useRealTimeProcess() {
            this.config.isBatchProcess = false;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.channels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var channel = _step2.value;

                    if (channel instanceof _Channel2.default) {
                        channel.useRealTimeProcess();
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
        /**
         * Turn on the batching process for *all* <Channel(s)>--
         *  including future additions--and queue *all* events
         *  that get captured. They will be stored in the queue
         *  until << .process() >> is invoked.
         */

    }, {
        key: "useBatchProcess",
        value: function useBatchProcess() {
            this.config.isBatchProcess = true;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.channels[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var channel = _step3.value;

                    if (channel instanceof _Channel2.default) {
                        channel.useBatchProcess();
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

        /**
         * Invoke the << .process >> command on all <Channel(s)>
         *  to create an ordered execution chain.
         */

    }, {
        key: "process",
        value: function process() {
            for (var _len = arguments.length, channels = Array(_len), _key = 0; _key < _len; _key++) {
                channels[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = channels[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var nameOrChannel = _step4.value;

                    var channel = void 0;
                    if (typeof nameOrChannel === "string" || nameOrChannel instanceof String) {
                        channel = this.channels[nameOrChannel];
                    } else {
                        channel = nameOrChannel;
                    }

                    if (channel instanceof _Channel2.default) {
                        channel.process();
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
        /**
         * Invoke the << .empty >> command on all <Channel(s)>
         */

    }, {
        key: "emptyChannels",
        value: function emptyChannels() {
            for (var _len2 = arguments.length, channels = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                channels[_key2] = arguments[_key2];
            }

            if (channels.length === 0) {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.channels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var channel = _step5.value;

                        channel.empty();
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

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = channels[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var name = _step6.value;

                    var _channel = this.channels[name];

                    if (_channel instanceof _Channel2.default) {
                        _channel.empty();
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

            return this;
        }

        /**
         * Create and send a <Message> directly to the invoking <Network>
         *  This will pass the message to << .receive >>
         */

    }, {
        key: "emit",
        value: function emit(emitter, event) {
            if (_Message2.default.Conforms(emitter)) {
                this.receive(emitter);
            } else if (_Message2.default.Conforms(event)) {
                this.receive(event);
            } else {
                for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                    args[_key3 - 2] = arguments[_key3];
                }

                this.receive(new (Function.prototype.bind.apply(_Message2.default, [null].concat([emitter, event], args)))());
            }

            return this;
        }
    }, {
        key: "receive",
        value: function receive(message) {
            var msg = message;
            if (typeof this.config.middleware === "function") {
                msg = this.config.middleware(message);
            }

            this.router.route(msg);
        }

        /**
         * Create a <Channel> to which events can be routed
         *  and handled in an isolated scope.
         */

    }, {
        key: "createChannel",
        value: function createChannel(name) {
            var channel = void 0;

            if (name instanceof _Channel2.default) {
                channel = name;
            } else {
                for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                    args[_key4 - 1] = arguments[_key4];
                }

                channel = new (Function.prototype.bind.apply(_Channel2.default, [null].concat(args)))();
            }

            this.channels.register(channel, name);

            if (this.config.isBatchProcess) {
                channel.useBatchProcess();
            } else {
                channel.useRealTimeProcess();
            }

            return channel;
        }
        /**
         * A convenience method to iteratively invoke << createChannel >>
         */

    }, {
        key: "createChannels",
        value: function createChannels() {
            var createChannelArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var channels = [];
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = createChannelArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _step7$value = _toArray(_step7.value),
                        name = _step7$value[0],
                        _args = _step7$value.slice(1);

                    channels.push(this.createChannel.apply(this, [name].concat(_toConsumableArray(_args))));
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

            return channels;
        }
        /**
         * Remove a <Channel> event route
         */

    }, {
        key: "destroyChannel",
        value: function destroyChannel(nameOrChannel) {
            return this.channels.unregister(nameOrChannel);
        }
        /**
         * A convenience method to iteratively invoke << destroyChannel >>
         */

    }, {
        key: "destroyChannels",
        value: function destroyChannels() {
            var destroyChannelArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var results = [];
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = destroyChannelArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var _step8$value = _toArray(_step8.value),
                        name = _step8$value[0],
                        _args2 = _step8$value.slice(1);

                    results.push(this.destroyChannel.apply(this, [name].concat(_toConsumableArray(_args2))));
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

            return results;
        }
    }]);

    return MessageBus;
}();

;

exports.default = MessageBus;