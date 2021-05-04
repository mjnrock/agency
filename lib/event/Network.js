"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BasicNetwork = exports.Network = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _Registry2 = require("../Registry");

var _Registry3 = _interopRequireDefault(_Registry2);

var _Context = require("./Context");

var _Context2 = _interopRequireDefault(_Context);

var _Emitter = require("./Emitter");

var _Emitter2 = _interopRequireDefault(_Emitter);

var _Router = require("./Router");

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Network = exports.Network = function (_Registry) {
    _inherits(Network, _Registry);

    function Network() {
        var contexts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var connections = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        _classCallCheck(this, Network);

        // allow the <Network> to broadcast messages to other connected <Network(s)>
        var _this2 = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this));

        _this2.connections = new Set(connections); //? Connect children to parents for a hierarchy

        // store the modified routing functions for all member <Emitter(s)> so that leaving can properly clean them up
        _this2.cache = new WeakMap();
        // create event routing contexts with qualifier functions to in/exclude events
        _this2.router = new _Router2.default(contexts, routes);
        return _this2;
    }

    /**
     * Invoke << .process >> on all <Context(s)>
     */


    _createClass(Network, [{
        key: "processAll",
        value: function processAll() {
            this.router.process();
        }
        /**
         * Invoke << .drop >> on all <Context(s)>
         */

    }, {
        key: "emptyAll",
        value: function emptyAll() {
            this.router.empty();
        }

        /**
         * Route a .emit or .asyncEmit event from <Emitter>
         *  to the routing system
         */

    }, {
        key: "route",
        value: function route(payload) {
            try {
                payload.provenance.add(this);
            } catch (e) {}

            this.router.route(payload);

            return this;
        }
        /**
         * Create and route an event with specified @emitter
         */

    }, {
        key: "emit",
        value: function emit(emitter, event) {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            this.route({
                id: (0, _uuid.v4)(),
                type: event,
                data: args,
                emitter: emitter,
                provenance: new Set([emitter])
            });

            return this;
        }

        /**
         * Create and/or route an event to all << .connections >>
         *  attached to the <Network>.  If @emitter looks like
         *  a payload and args.length === 1, @emitter will
         *  be sent via << .route >>, instead of << .emit >>.
         */

    }, {
        key: "broadcast",
        value: function broadcast(emitter, event) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.connections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var connection = _step.value;

                    if (connection instanceof Network) {
                        if (arguments.length === 1 && (typeof emitter === "undefined" ? "undefined" : _typeof(emitter)) === "object" && "type" in emitter) {
                            connection.route(emitter);
                        } else {
                            connection.emit.apply(connection, [emitter, event].concat(args));
                        }
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

            return this;
        }

        /**
         * This will register the <Emitter> with the <Network>,
         *  create a routing function, and subscriber that function
         *  to the <Emitter>.  That function routes *all* events to
         *  the <Router>, where you can create routes to handle them.
         */

    }, {
        key: "join",
        value: function join() {
            var _this3 = this;

            for (var _len3 = arguments.length, emitters = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                emitters[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop = function _loop() {
                    var emitter = _step2.value;

                    _this3.register(emitter);

                    var _this = _this3;
                    var fn = function fn() {
                        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                            args[_key4] = arguments[_key4];
                        }

                        _this.route.apply(_this, [this].concat(args));
                    };

                    _this3.cache.set(emitter, fn);

                    emitter.addSubscriber(fn);
                };

                for (var _iterator2 = emitters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
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
         * This undoes and cleans up everything that .join does
         */

    }, {
        key: "leave",
        value: function leave() {
            for (var _len5 = arguments.length, emitters = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                emitters[_key5] = arguments[_key5];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = emitters[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var emitter = _step3.value;

                    var fn = this.cache.get(emitter);

                    emitter.removeSubscriber(fn);
                    this.unregister(emitter);
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
         * Connect <Network(s)> for use with << .broadcast >>
         */

    }, {
        key: "link",
        value: function link() {
            for (var _len6 = arguments.length, networks = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                networks[_key6] = arguments[_key6];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = networks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var network = _step4.value;

                    this.connections.add(network);
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
         * Disconnect <Network(s)>
         */

    }, {
        key: "unlink",
        value: function unlink() {
            for (var _len7 = arguments.length, networks = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                networks[_key7] = arguments[_key7];
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = networks[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var network = _step5.value;

                    this.connections.delete(network);
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
        /**
         * Link << this >> from @network and vice-versa.
         */

    }, {
        key: "dualLink",
        value: function dualLink() {
            for (var _len8 = arguments.length, networks = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                networks[_key8] = arguments[_key8];
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = networks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var network = _step6.value;

                    this.connections.add(network);
                    network.connections.add(this);
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
         * Unlink << this >> from @network and vice-versa.
         */

    }, {
        key: "dualUnlink",
        value: function dualUnlink() {
            for (var _len9 = arguments.length, networks = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                networks[_key9] = arguments[_key9];
            }

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = networks[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var network = _step7.value;

                    this.connections.delete(network);
                    network.connections.delete(this);
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
         * Send the payload to another <Context> directly (i.e. bypass route)
         */

    }, {
        key: "sendToContext",
        value: function sendToContext(nameOrContext, payload) {
            var context = this.router[nameOrContext];

            if (context instanceof _Context2.default) {
                context.bus(payload);
            }

            return this;
        }

        /**
         * Cause every <Emitter> member of the <Network> to
         *  invoke an event via << Emitter.$.emit >>
         */

    }, {
        key: "fire",
        value: function fire(event) {
            for (var _len10 = arguments.length, args = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
                args[_key10 - 1] = arguments[_key10];
            }

            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var emitter = _step8.value;

                    if (emitter instanceof _Emitter2.default) {
                        var _emitter$$;

                        (_emitter$$ = emitter.$).emit.apply(_emitter$$, [event].concat(args));
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
        /**
         * Cause every <Emitter> member of the <Network> to
         *  invoke an async event via << Emitter.$.asyncEmit >>
         */

    }, {
        key: "asyncFire",
        value: async function asyncFire(event) {
            for (var _len11 = arguments.length, args = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
                args[_key11 - 1] = arguments[_key11];
            }

            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var emitter = _step9.value;

                    if (emitter instanceof _Emitter2.default) {
                        var _emitter$$2;

                        await (_emitter$$2 = emitter.$).asyncEmit.apply(_emitter$$2, [event].concat(args));
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

            return Promise.resolve(this);
        }

        /**
         * A convenience getter to easily access a default <Network>
         *  when a multi-network setup is unnecessary.
         */

    }], [{
        key: "$$",
        value: function $$(networkIdOrSyn) {
            return Network.Instances[networkIdOrSyn];
        }

        /**
         * Recreate the .Instances registry with optional seeding
         */

    }, {
        key: "Recreate",
        value: function Recreate() {
            var networks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var createDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            Network.Instances = new _Registry3.default({ Registry: { entries: networks } });

            if (createDefault) {
                Network.Instances.register(new Network(), "agency");
                Network.Instances.register(new Network(), "default");
            }
        }
    }, {
        key: "Register",
        value: function Register() {
            for (var _len12 = arguments.length, names = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                names[_key12] = arguments[_key12];
            }

            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = names[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var name = _step10.value;

                    Network.Instances.register(new Network(), name);
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
        }
    }, {
        key: "Unregister",
        value: function Unregister() {
            for (var _len13 = arguments.length, names = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                names[_key13] = arguments[_key13];
            }

            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = names[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var name = _step11.value;

                    Network.Instances.unregister(name);
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
        }
    }, {
        key: "BasicNetwork",
        value: function BasicNetwork() {
            var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new _BasicNetwork(handlers, opts);
        }
    }, {
        key: "$",
        get: function get() {
            if (!(Network.Instances || {}).default) {
                Network.Recreate();
            }

            return Network.Instances.default;
        }
    }]);

    return Network;
}(_Registry3.default);

Network.Instances = new _Registry3.default();
;

/**
 * Create a "default", single-context <Network>, that processes in **real-time**
 * @args <Context> constructor args
 * @name The name of the created <Context> in this.router
 */

var _BasicNetwork = function (_Network) {
    _inherits(_BasicNetwork, _Network);

    function _BasicNetwork() {
        var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref$name = _ref.name,
            name = _ref$name === undefined ? "default" : _ref$name,
            _ref$useBatch = _ref.useBatch,
            useBatch = _ref$useBatch === undefined ? false : _ref$useBatch,
            rest = _objectWithoutProperties(_ref, ["name", "useBatch"]);

        _classCallCheck(this, _BasicNetwork);

        var _this4 = _possibleConstructorReturn(this, (_BasicNetwork.__proto__ || Object.getPrototypeOf(_BasicNetwork)).call(this));

        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {

            for (var _iterator12 = Object.entries(handlers)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var _step12$value = _slicedToArray(_step12.value, 2),
                    key = _step12$value[0],
                    value = _step12$value[1];

                if (value === _BasicNetwork.Relay) {
                    handlers[key] = value(_this4);
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

        _this4.router.createContext(name, _extends({ handlers: handlers }, rest));
        _this4.router.createRoute(function () {
            return name;
        });

        if (useBatch === false) {
            _this4.router.useRealTimeProcess();
        }
        return _this4;
    }

    return _BasicNetwork;
}(Network);

_BasicNetwork.Relay = function (network) {
    return function () {
        network.broadcast(this);
    };
};

exports.BasicNetwork = _BasicNetwork;
exports.default = Network;