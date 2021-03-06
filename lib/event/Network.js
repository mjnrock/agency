"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Network = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _AgencyBase2 = require("./../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

var _MessageBus = require("./MessageBus");

var _MessageBus2 = _interopRequireDefault(_MessageBus);

var _Dispatcher = require("./Dispatcher");

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

var _Receiver = require("./Receiver");

var _Receiver2 = _interopRequireDefault(_Receiver);

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

var _Watchable = require("./watchable/Watchable");

var _Watchable2 = _interopRequireDefault(_Watchable);

var _Controller = require("./Controller");

var _Controller2 = _interopRequireDefault(_Controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 
 * 1) Create <Network>
 * 2) Invoke << .addListener >> on any entity that should become aware of state changes
 * 3) Create a handler paradigm to invoke << .broadcast >> on Network.Signal.UPDATE
 */
var Network = exports.Network = function (_AgencyBase) {
    _inherits(Network, _AgencyBase);

    function Network() {
        var _default;

        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var modify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Network);

        var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this));

        _this.__bus = new _MessageBus2.default();
        _this.__connections = new Map();
        _this.__state = new _Watchable2.default(state, {
            network: _this,
            useControlMessages: true
        });

        _this.modify({
            $routes: [function (message) {
                return "default";
            }],
            default: (_default = {}, _defineProperty(_default, Network.Signal.UPDATE, function (msg, _ref) {
                var broadcast = _ref.broadcast;
                return broadcast(msg);
            }), _defineProperty(_default, "$globals", {
                network: _this,
                getState: function getState() {
                    return _this.state;
                },
                setState: function setState(state) {
                    return _this.state = state;
                },
                mergeState: function mergeState() {
                    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    return _this.state = _extends({}, _this.state, state);
                },
                message: _this.message.bind(_this),
                broadcast: _this.broadcast.bind(_this)
            }), _default)
        });
        _this.modify(modify);
        return _this;
    }

    _createClass(Network, [{
        key: Symbol.iterator,
        value: function value() {
            var index = -1;
            var data = Object.entries(this.state);

            return {
                next: function next() {
                    return { value: data[++index], done: !(index in data) };
                }
            };
        }

        /**
         * A helper function to make broad changes to the network configuration
         *  within a single argument object.  This accepts new channel arguments,
         *  new route arguments, and removal arguments for both.
         * 
         * * COMMAND LIST
         * 
         * *) [ channelName ]: { ...handlers, $globals: { ... } }
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

    }, {
        key: "modify",
        value: function modify() {
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
                        entries = _step2$value[1];

                    var _channel = this.__bus.channels[channelName] || this.__bus.createChannel(channelName);

                    _channel.parseHandlerObject(entries);
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
        * Add a listener to receive << .broadcast >> messages
        * 
         * @addSelfToDefaultGlobal | Add << this >> to default channel globals via { [ addSelfToDefaultGlobal ]: this }
         *      As such, whatever string value is passed will be used as the key
         */

    }, {
        key: "addListener",
        value: function addListener(entity) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                callback = _ref2.callback,
                filter = _ref2.filter,
                _ref2$addToDefaultGlo = _ref2.addToDefaultGlobal,
                addToDefaultGlobal = _ref2$addToDefaultGlo === undefined ? false : _ref2$addToDefaultGlo;

            if (!!entity && !callback) {
                return this.__emptyJoin(entity, { filter: filter, addToDefaultGlobal: addToDefaultGlobal });
            }

            var cache = this.__createCacheObject(entity, callback, filter);
            this.__connections.set(entity, cache);

            if ((typeof addToDefaultGlobal === "string" || addToDefaultGlobal instanceof String) && entity instanceof Network) {
                entity.modify({
                    default: {
                        $globals: _defineProperty({}, addToDefaultGlobal, this)
                    }
                });
            }

            if (entity instanceof _Watchable2.default) {
                entity.__controller.network = cache.controller;
            }

            return cache.controller;
        }
        /**
        * Remove a listener to stop receiving << .broadcast >> messages
        */

    }, {
        key: "removeListener",
        value: function removeListener(entity) {
            return this.__connections.delete(entity);
        }

        /**
         * This is a "reverse" of << .addListener >>
         */

    }, {
        key: "tuneIn",
        value: function tuneIn(network, opts) {
            if (network instanceof Network) {
                return network.addListener(this, opts);
            }
        }
        /**
         * This is a "reverse" of << .removeListener >>
         */

    }, {
        key: "tuneOut",
        value: function tuneOut(network) {
            if (network instanceof Network) {
                return network.removeListener(this);
            }
        }

        /**
         * Create and route a message normally.
         */

    }, {
        key: "message",
        value: function message(type) {
            var _bus;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            (_bus = this.__bus).emit.apply(_bus, [this, type].concat(args));
        }
        /**
         * Route a <MessageCollection>
         */

    }, {
        key: "collection",
        value: function collection(messages, middleware) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = messages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var msg = _step3.value;

                    if (typeof middleware === "function") {
                        msg = middleware(msg) || msg;
                    }

                    this.message(msg);
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
        }
        /**
         * Send a message to all connections, invoking the callback
         *  function on each receiver.
         */

    }, {
        key: "broadcast",
        value: function broadcast() {
            var message = void 0;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (args.length > 1) {
                message = _Message2.default.Generate.apply(_Message2.default, [this].concat(args));
            } else if (_Message2.default.ConformsBasic(args[0])) {
                message = args[0];
            } else {
                message = args;
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.__connections.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _ref4 = _step4.value;
                    var receiver = _ref4.receiver;

                    if (receiver instanceof _Receiver2.default) {
                        receiver.receive(message);
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
        }

        /**
         * Pass a message from one channel to another.
         */

    }, {
        key: "sendToChannel",
        value: function sendToChannel(channel, msg) {
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
        key: "sendToAllChannels",
        value: function sendToAllChannels(msg) {
            var _this2 = this;

            var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            if (!Array.isArray(exclude)) {
                exclude = [exclude];
            }

            exclude = exclude.map(function (name) {
                return _this2.ch[name];
            });

            if (exclude.length) {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.ch[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var channel = _step5.value;

                        if (!exclude.includes(channel)) {
                            channel.bus(msg);
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
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this.ch[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _channel2 = _step6.value;

                        _channel2.bus(msg);
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
        }

        /**
         * A shorthand getter for a "getChannel"-like function
         */

    }, {
        key: "ch",
        value: function ch(name) {
            return this.__bus.channels[name];
        }

        /**
         * This will retrieve the cache controller object generated by << .addListener >>,
         *  as an alternative to saving the return value.
         */

    }, {
        key: "ctrl",
        value: function ctrl(entity) {
            var cache = this.__connections.get(entity) || {};

            return cache.controller || {};
        }
    }, {
        key: "__createCacheObject",
        value: function __createCacheObject(entity, callback, filter) {
            var cache = {
                dispatcher: new _Dispatcher2.default(this, entity),
                receiver: new _Receiver2.default(callback, filter || function (msg) {
                    return msg.emitter !== entity;
                }),
                controller: {}
            };

            cache.controller = new _Controller2.default(this, entity, cache);

            return cache;
        }
    }, {
        key: "__emptyJoin",
        value: function __emptyJoin(entity) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (entity instanceof Network) {
                return this.addListener(entity, _extends({}, opts, {
                    callback: entity.__bus.receive.bind(entity.__bus)
                }));
            }

            var finalEntity = (typeof entity === "undefined" ? "undefined" : _typeof(entity)) === "object" ? entity : {
                id: (0, _uuid.v4)(),
                value: entity
            };
            return this.addListener(finalEntity, {
                callback: function callback() {}
            });
        }
    }, {
        key: "state",
        get: function get() {
            return this.__state;
        },
        set: function set(state) {
            var oldState = this.__state.toObject(),
                newState = Object.assign({}, state);

            this.__state.$set = state;

            this.__bus.emit(this, Network.Signal.UPDATE, newState, oldState);
        }
    }, {
        key: "$",
        get: function get() {
            return this.state;
        }
    }]);

    return Network;
}(_AgencyBase3.default);

Network.Signal = {
    UPDATE: "Network:Update",
    RELAY: "Network:Relay"
};
;

exports.default = Network;