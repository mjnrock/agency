"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BasicNetwork = exports.Network = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _Registry2 = require("../Registry");

var _Registry3 = _interopRequireDefault(_Registry2);

var _Context = require("./Context");

var _Context2 = _interopRequireDefault(_Context);

var _Dispatcher = require("./Dispatcher");

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

var _Router = require("./Router");

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Network = exports.Network = function (_Registry) {
    _inherits(Network, _Registry);

    function Network() {
        var contexts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$connections = _ref.connections,
            connections = _ref$connections === undefined ? [] : _ref$connections,
            _ref$state = _ref.state,
            state = _ref$state === undefined ? {} : _ref$state;

        _classCallCheck(this, Network);

        // allow the <Network> to broadcast messages to other connected <Network(s)>
        var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this));

        _this.connections = new Set(connections); //? e.g. Connect children to parents for a hierarchy
        // create event routing contexts with qualifier functions to in/exclude events
        _this.router = new _Router2.default(_this, contexts, routes);

        _this._state = state;
        return _this;
    }

    _createClass(Network, [{
        key: "getState",
        value: function getState() {
            return this._state;
        }
    }, {
        key: "setState",
        value: function setState() {
            var _this2 = this;

            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var isMerge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var newState = {};

            if (isMerge) {
                newState = _extends({}, this._state, state);
            } else {
                newState = state;
            }

            var args = [Object.assign({}, newState), Object.assign({}, this._state), Object.assign({}, state)];
            setTimeout(function () {
                return _this2.emit.apply(_this2, [_this2, Network.Signals.UPDATE].concat(args));
            }, 0);

            this._state = newState;

            return this._state;
        }
    }, {
        key: "mergeState",
        value: function mergeState() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.setState(state, true);
        }

        /**
         * Invoke << .process >> on all <Context(s)>
         */

    }, {
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
                provenance: new Set([emitter]),
                timestamp: Date.now()
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
         * Connect <Network(s)> for use with << .broadcast >>
         */

    }, {
        key: "link",
        value: function link() {
            for (var _len3 = arguments.length, networks = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                networks[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = networks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var network = _step2.value;

                    this.connections.add(network);
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
         * Disconnect <Network(s)>
         */

    }, {
        key: "unlink",
        value: function unlink() {
            for (var _len4 = arguments.length, networks = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                networks[_key4] = arguments[_key4];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = networks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var network = _step3.value;

                    this.connections.delete(network);
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
         * Link << this >> from @network and vice-versa.
         */

    }, {
        key: "dualLink",
        value: function dualLink() {
            for (var _len5 = arguments.length, networks = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                networks[_key5] = arguments[_key5];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = networks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var network = _step4.value;

                    this.connections.add(network);
                    network.connections.add(this);
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
         * Unlink << this >> from @network and vice-versa.
         */

    }, {
        key: "dualUnlink",
        value: function dualUnlink() {
            for (var _len6 = arguments.length, networks = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                networks[_key6] = arguments[_key6];
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = networks[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var network = _step5.value;

                    this.connections.delete(network);
                    network.connections.delete(this);
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
         * Join the <Network>, wrapping and returning a map
         *  of the emitters and dispatchers.  If a <Dispatcher>
         *  is passed, << this >> will be assigned to its << .network >>
         */

    }, {
        key: "join",
        value: function join(subject) {
            var dispatcher = void 0;
            if (subject instanceof _Dispatcher2.default) {
                subject.network = this;
                dispatcher = subject;
            } else if ((typeof subject === "undefined" ? "undefined" : _typeof(subject)) === "object") {
                dispatcher = new _Dispatcher2.default(this, subject);
            } else {
                return false;
            }

            this.register(dispatcher);

            return dispatcher;
        }
    }, {
        key: "joinMany",
        value: function joinMany() {
            var dispatchers = new Map();

            for (var _len7 = arguments.length, subjects = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                subjects[_key7] = arguments[_key7];
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = subjects[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var subject = _step6.value;

                    dispatchers.set(subject, this.join(subject));
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

            return dispatchers;
        }

        /**
         * This undoes and cleans up everything that .join does
         */

    }, {
        key: "leave",
        value: function leave() {
            for (var _len8 = arguments.length, dispatchers = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                dispatchers[_key8] = arguments[_key8];
            }

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = dispatchers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var dispatcher = _step7.value;

                    if (dispatcher instanceof _Dispatcher2.default) {
                        this.unregister(dispatcher);
                    } else {
                        var subject = dispatcher,
                            result = void 0;

                        if (this.has(subject, function (entry, value) {
                            if (entry === value.subject) {
                                result = value;

                                return true;
                            }

                            return false;
                        })) {
                            this.unregister(result);
                        }
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

            return this;
        }

        /**
         * Cause every <Dispatcher> member of the <Network> to
         *  invoke the << @command >> network function.
         * 
         * @param command 'dispatch'|'broadcast'|'sendToContext'
         */

    }, {
        key: "fire",
        value: function fire(event) {
            var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var command = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "dispatch";
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var dispatcher = _step8.value;

                    if (dispatcher instanceof _Dispatcher2.default) {
                        dispatcher[command].apply(dispatcher, [event].concat(_toConsumableArray(args)));
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
        key: "storeGlobal",
        value: function storeGlobal(contextName, name, value) {
            if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") {
                this.router[contextName].globals = _extends({}, this.router[contextName].globals, name);
            } else {
                this.router[contextName].globals[name] = value;
            }

            return this;
        }
    }, {
        key: "unstoreGlobal",
        value: function unstoreGlobal(contextName, input) {
            if (Array.isArray(input)) {
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = input[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var key = _step9.value;

                        delete this.router[contextName].globals[key];
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
            } else {
                delete this.router[contextName].globals[input];
            }

            return this;
        }
    }], [{
        key: "$",
        value: function $() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

            if (name === "default" && !Network.Instances[name]) {
                Network.Instances[name] = new BasicNetwork();
            }

            return Network.Instances[name];
        }

        /**
         * A convenience factory method for <BasicNetwork>
         */

    }, {
        key: "SimpleSetup",
        value: function SimpleSetup() {
            var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new BasicNetwork(handlers, opts);
        }
    }]);

    return Network;
}(_Registry3.default);

Network.Instances = new _Registry3.default();
Network.Signals = {
    UPDATE: "Network.Update"
};
;

/**
 * Create a "default", single-context <Network>, that processes in **real-time**
 * @args <Context> constructor args
 * @name The name of the created <Context> in this.router
 */

var BasicNetwork = exports.BasicNetwork = function (_Network) {
    _inherits(BasicNetwork, _Network);

    function BasicNetwork() {
        var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref2$contextName = _ref2.contextName,
            contextName = _ref2$contextName === undefined ? "default" : _ref2$contextName,
            _ref2$useBatch = _ref2.useBatch,
            useBatch = _ref2$useBatch === undefined ? false : _ref2$useBatch,
            rest = _objectWithoutProperties(_ref2, ["contextName", "useBatch"]);

        _classCallCheck(this, BasicNetwork);

        var _this3 = _possibleConstructorReturn(this, (BasicNetwork.__proto__ || Object.getPrototypeOf(BasicNetwork)).call(this));

        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {

            for (var _iterator10 = Object.entries(handlers)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var _step10$value = _slicedToArray(_step10.value, 2),
                    key = _step10$value[0],
                    value = _step10$value[1];

                if (value === BasicNetwork.Relay) {
                    handlers[key] = value(_this3);
                }
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

        _this3.router.createContext(contextName, _extends({ handlers: handlers }, rest));
        _this3.router.createRoute(function () {
            return contextName;
        });

        if (useBatch === true) {
            _this3.router.useBatchProcess();
        } else {
            _this3.router.useRealTimeProcess();
        }
        return _this3;
    }

    _createClass(BasicNetwork, [{
        key: "storeGlobal",
        value: function storeGlobal(name, key) {
            var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref3$contextName = _ref3.contextName,
                contextName = _ref3$contextName === undefined ? "default" : _ref3$contextName;

            return _get(BasicNetwork.prototype.__proto__ || Object.getPrototypeOf(BasicNetwork.prototype), "storeGlobal", this).call(this, contextName, name, key);
        }
    }, {
        key: "unstoreGlobal",
        value: function unstoreGlobal(name, key) {
            var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref4$contextName = _ref4.contextName,
                contextName = _ref4$contextName === undefined ? "default" : _ref4$contextName;

            return _get(BasicNetwork.prototype.__proto__ || Object.getPrototypeOf(BasicNetwork.prototype), "unstoreGlobal", this).call(this, contextName, name, key);
        }
    }]);

    return BasicNetwork;
}(Network);

BasicNetwork.Relay = function (network) {
    return function () {
        network.broadcast(this);
    };
};

;

exports.default = Network;