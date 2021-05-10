"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Network = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _AgencyBase2 = require("./../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

var _Registry = require("./../Registry");

var _Registry2 = _interopRequireDefault(_Registry);

var _MessageBus = require("./MessageBus");

var _MessageBus2 = _interopRequireDefault(_MessageBus);

var _Dispatcher = require("./Dispatcher");

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

var _Receiver = require("./Receiver");

var _Receiver2 = _interopRequireDefault(_Receiver);

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 
 * 1) Create <Network>
 * 2) Invoke << .join >> on any entity that should become aware of state changes
 * 3) Create a handler paradigm to invoke << .broadcast >> on Network.Signals.UPDATE
 */
var Network = exports.Network = function (_AgencyBase) {
    _inherits(Network, _AgencyBase);

    function Network() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var modify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Network);

        //TODO  The "_internal" channel is *NOT* actually private yet, and currently functions as a normal channel
        var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this));

        _this.__bus = new _MessageBus2.default(["_internal"], [function (message) {
            return message.type === Network.Signals.UPDATE ? "_internal" : null;
        }]);
        _this.__bus.channels._internal.globals.broadcast = _this.broadcast.bind(_this);
        _this.__bus.channels._internal.addHandler(Network.Signals.UPDATE, function (msg) {
            return _this.multiPass(msg, "_internal");
        });

        _this.__connections = new _Registry2.default();
        _this.__cache = new WeakMap();

        _this.__state = state;

        _this.alter(modify);
        return _this;
    }

    _createClass(Network, [{
        key: "alter",


        /**
         * A helper function to make broad changes to the network configuration
         *  within a single argument object.  This accepts new channel arguments,
         *  new route arguments, and removal arguments for both.
         * 
         * * COMMAND LIST
         * 
         * *) [ channelName ]: { handlers, globals }
         * *) $routes: [ ...fns ]
         * *) $channels: [ ...<Channel> ]
         * *) $delete: { routes: [ ...fns ], channels: [ ...name|<Channel> ] }
         * 
         * Example @obj:
         *  {
         *      [ "Cats" ]: { handlers: [ [ "cat", handlerCat ], ... ] },
         *      $routes: [ routeFn1, routeFn2 ],
         *      $delete: { channels: [ ChannelDog ] },
         *      ...
         *  }
         */
        value: function alter() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (obj.$routes) {
                this.__bus.router.createRoutes(obj.$routes);
                delete obj.$routes;
            }

            if (obj.$delete) {
                var _obj$$delete = obj.$delete,
                    routes = _obj$$delete.routes,
                    channels = _obj$$delete.channels;


                if (routes) {
                    this.__bus.router.destroyRoutes(routes);
                }

                if (channels) {
                    this.__bus.destroyChannels(channels);
                }

                delete obj.$delete;
            }

            if (obj.$channels && Array.isArray(obj.$channels)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = obj.$channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var channel = _step.value;

                        this.__bus.createChannel(channel);
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

                delete obj.$channels;
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.entries(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        channelName = _step2$value[0],
                        _step2$value$ = _step2$value[1],
                        _step2$value$$globals = _step2$value$.globals,
                        globals = _step2$value$$globals === undefined ? {} : _step2$value$$globals,
                        _step2$value$$handler = _step2$value$.handlers,
                        handlers = _step2$value$$handler === undefined ? {} : _step2$value$$handler;

                    var _channel = this.__bus.channels[channelName] || this.__bus.createChannel(channelName);

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = Object.entries(globals)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _step3$value = _slicedToArray(_step3.value, 2),
                                key = _step3$value[0],
                                value = _step3$value[1];

                            _channel.globals[key] = value;
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

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = Object.entries(handlers)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _step4$value = _slicedToArray(_step4.value, 2),
                                name = _step4$value[0],
                                fn = _step4$value[1];

                            _channel.addHandler(name, fn);
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
         * A helper function for when no other arguments are passed
         *  besides @entity.  This is used for situations where the
         *  callback/filter are seeded later.
         */

    }, {
        key: "_emptyJoin",
        value: function _emptyJoin() {
            return this.join({
                id: (0, _uuid.v4)()
            });
        }
    }, {
        key: "join",
        value: function join(entity) {
            var _connections,
                _this2 = this;

            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                callback = _ref.callback,
                filter = _ref.filter,
                _ref$synonyms = _ref.synonyms,
                synonyms = _ref$synonyms === undefined ? [] : _ref$synonyms;

            if (!!entity && !callback && !filter) {
                return this._emptyJoin();
            }

            (_connections = this.__connections).register.apply(_connections, [entity].concat(_toConsumableArray(synonyms)));

            var cache = {
                dispatcher: new _Dispatcher2.default(this, entity),
                receiver: new _Receiver2.default(callback, filter),
                synonyms: synonyms
            };
            this.__cache.set(entity, cache);

            return {
                dispatch: cache.dispatcher.dispatch,
                broadcast: cache.dispatcher.broadcast,
                receiver: function receiver() {
                    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                        callback = _ref2.callback,
                        filter = _ref2.filter;

                    var data = _this2.__cache.get(entity);

                    if (!data) {
                        return -1; // Cache record does not exist
                    }

                    var wasUpdated = false;
                    if (typeof callback === "function") {
                        data.receiver.__callback = callback;
                        wasUpdated = true;
                    }
                    if (typeof filter === "function") {
                        data.receiver.__filter = filter;
                        wasUpdated = true;
                    }

                    if (wasUpdated) {
                        _this2.__cache.set(entity, data);

                        return true;
                    }

                    return false;
                }
            };
        }
    }, {
        key: "leave",
        value: function leave(entity) {
            this.__connections.unregister(entity);

            return this.__cache.delete(entity);
        }
    }, {
        key: "getChannel",
        value: function getChannel(name) {
            return this.__bus.channels[name];
        }

        /**
         * Create and route a message normally.
         */

    }, {
        key: "emit",
        value: function emit(type) {
            var _bus;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            (_bus = this.__bus).emit.apply(_bus, [this, type].concat(args));
        }

        /**
         * Pass a message from one channel to another.
         */

    }, {
        key: "pass",
        value: function pass(channel, msg) {
            if (channel instanceof _Channel2.default) {
                channel.bus(msg);
            } else {
                this.__bus.channels[channel].bus(msg);
            }
        }
        /**
         * Pass a message to all channels, with optional exclulsions.
         */

    }, {
        key: "multiPass",
        value: function multiPass(msg) {
            var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            if (exclude.length) {
                if (!Array.isArray(exclude)) {
                    exclude = [exclude];
                }

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.__bus.channels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var channel = _step5.value;
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = exclude[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var ignore = _step6.value;

                                if (this.__bus.channels[ignore] !== channel) {
                                    channel.bus(msg);
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
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.__bus.channels[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var _channel2 = _step7.value;

                        _channel2.bus(msg);
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

        /**
         * Send a message to all connections, invoking the callback
         *  function on each receiver.
         */

    }, {
        key: "broadcast",
        value: function broadcast(message) {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.__connections[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var member = _step8.value;

                    var _cache$get = this.__cache.get(member),
                        receiver = _cache$get.receiver;

                    if (receiver instanceof _Receiver2.default) {
                        receiver.receive(message);
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
        }
    }, {
        key: "state",
        get: function get() {
            return this.__state;
        },
        set: function set(state) {
            var oldState = Object.assign({}, this.__state),
                newState = Object.assign({}, state);

            this.__state = state;

            this.__bus.emit(this, Network.Signals.UPDATE, newState, oldState);
        }
    }]);

    return Network;
}(_AgencyBase3.default);

Network.Signals = {
    UPDATE: "Network.Update"
};
;

exports.default = Network;