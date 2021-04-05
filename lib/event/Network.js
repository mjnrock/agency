"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Network = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Registry2 = require("../Registry");

var _Registry3 = _interopRequireDefault(_Registry2);

var _Context = require("./Context");

var _Context2 = _interopRequireDefault(_Context);

var _Router = require("./Router");

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Network = exports.Network = function (_Registry) {
    _inherits(Network, _Registry);

    /**
     * For single-network usage, accessing the static $ property
     *      will create a "default" network automatically, if one does
     *      not exist with the synonym "default".  As such, a generic,
     *      default network can always be referenced via $.
     * 
     * In order to properly utilize a multi-network system, overwrite
     *      the << Network.Middleware >> method to introduce qualifying
     *      behavior that will appropriately register each newly
     *      instantiated <Emitter> to its appropriate <Network>.
     * 
     * NOTE:    By default, the << Emitter.$ >> global will join the default
     *      <Network>, and as such, there will always be a global <Emitter>
     *      that can be used for whatever purpose.  If this is problematic,
     *      invoke << Network.Recreate(); >> before any meaningful additions.
     *      This will recreate the default <Network> and thus drop the <Emitter>.
     */
    function Network() {
        _classCallCheck(this, Network);

        // store the modified routing functions for all member <Emitter(s)> so that leaving can properly clean them up
        var _this2 = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this));

        _this2.cache = new WeakMap();
        // create event routing contexts with qualifier functions to in/exclude events
        _this2.router = new _Router2.default();
        return _this2;
    }

    _createClass(Network, [{
        key: "share",
        value: function share(nameOrContext, payload) {
            var context = this.router[nameOrContext];

            if (context instanceof _Context2.default) {
                for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    args[_key - 2] = arguments[_key];
                }

                context.bus.apply(context, [payload].concat(args));
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

            for (var _len2 = arguments.length, emitters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                emitters[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var emitter = _step.value;

                    _this3.register(emitter);

                    var _this = _this3;
                    var fn = function fn() {
                        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                            args[_key3] = arguments[_key3];
                        }

                        _this.route.apply(_this, [this].concat(args));
                    };

                    _this3.cache.set(emitter, fn);

                    emitter.addSubscriber(fn);
                };

                for (var _iterator = emitters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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
         * This undoes and cleans up everything that .join does
         */

    }, {
        key: "leave",
        value: function leave() {
            for (var _len4 = arguments.length, emitters = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                emitters[_key4] = arguments[_key4];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = emitters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var emitter = _step2.value;

                    var fn = this.cache.get(emitter);

                    emitter.removeSubscriber(fn);
                    this.unregister(emitter);
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
         * Route a .emit or .asyncEmit event from <Emitter>
         *  to the routing system
         */

    }, {
        key: "route",
        value: function route(payload) {
            var _router;

            for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
            }

            (_router = this.router).route.apply(_router, [payload].concat(args));
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
         * Cause every <Emitter> member of the <Network> to
         *  invoke an event via << Emitter.$.emit >>
         */

    }, {
        key: "fire",
        value: function fire(event) {
            for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                args[_key6 - 1] = arguments[_key6];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _emitter$$;

                    var emitter = _step3.value;

                    (_emitter$$ = emitter.$).emit.apply(_emitter$$, [event].concat(args));
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
         * Cause every <Emitter> member of the <Network> to
         *  invoke an async event via << Emitter.$.asyncEmit >>
         */

    }, {
        key: "asyncFire",
        value: async function asyncFire(event) {
            for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                args[_key7 - 1] = arguments[_key7];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _emitter$$2;

                    var emitter = _step4.value;

                    (_emitter$$2 = emitter.$).asyncEmit.apply(_emitter$$2, [event].concat(args));
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
         * A convenience getter to easily access a default <Network>
         *  when a multi-network setup is unnecessary.
         */

    }], [{
        key: "Recreate",


        /**
         * Recreate the .Instances registry with optional seeding
         */
        value: function Recreate() {
            var networks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var createDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            Network.Instances = new _Registry3.default({ Registry: { entries: networks } });

            if (createDefault) {
                Network.Instances.register(new Network(), "default");
            }
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

Network.Middleware = function (emitter) {
    return Network.$.join(emitter);
};

;

exports.default = Network;