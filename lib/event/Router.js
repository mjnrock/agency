"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = exports.$Router = exports.EnumRouteType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase = require("../AgencyBase");

var _AgencyBase2 = _interopRequireDefault(_AgencyBase);

var _Registry = require("../Registry");

var _Context = require("./Context");

var _Context2 = _interopRequireDefault(_Context);

var _helper = require("../util/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumRouteType = exports.EnumRouteType = {
    MatchFirst: 1,
    MatchAll: 2
};

var $Router = function $Router($super) {
    return function (_$super) {
        _inherits(_class, _$super);

        function _class() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _ref$Router = _ref.Router,
                Router = _ref$Router === undefined ? {} : _ref$Router,
                rest = _objectWithoutProperties(_ref, ["Router"]);

            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));

            _this.__type = Router.type || EnumRouteType.MatchFirst;

            _this.__routes = new Set();
            _this.createRoutes.apply(_this, _toConsumableArray(Router.routes || []));
            return _this;
        }

        _createClass(_class, [{
            key: "route",
            value: function route(payload) {
                var hasResult = false;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.__routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var fn = _step.value;

                        var results = fn(payload);

                        if (!Array.isArray(results)) {
                            results = [results];
                        }

                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var result = _step2.value;

                                var context = this[result];

                                if (context instanceof _Context2.default) {
                                    context.bus(payload);

                                    hasResult = true;
                                } else if (typeof context === "function") {
                                    context(payload);
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

                        if (hasResult && this.__type === EnumRouteType.MatchFirst) {
                            return this;
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
        }, {
            key: "createRoute",
            value: function createRoute(filterFn) {
                if (typeof filterFn === "function") {
                    this.__routes.add(filterFn);
                }

                return this;
            }
        }, {
            key: "createRoutes",
            value: function createRoutes() {
                var filterFns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = filterFns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var fn = _step3.value;

                        this.createRoute(fn);
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
            key: "destroyRoute",
            value: function destroyRoute(filterFn) {
                if (typeof filterFn === "function") {
                    return this.__routes.delete(filterFn);
                }

                return false;
            }
        }, {
            key: "destroyRoutes",
            value: function destroyRoutes() {
                var results = [];

                for (var _len = arguments.length, filterFns = Array(_len), _key = 0; _key < _len; _key++) {
                    filterFns[_key] = arguments[_key];
                }

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = filterFns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var fn = _step4.value;

                        results.push(this.destroyRoute(fn));
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

                return results;
            }
        }]);

        return _class;
    }($super);
};

exports.$Router = $Router;

var Router = exports.Router = function (_compose) {
    _inherits(Router, _compose);

    function Router(network) {
        var contexts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var routes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        _classCallCheck(this, Router);

        var _this2 = _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this, {
            Router: {
                routes: [],
                type: EnumRouteType.MatchFirst
            }
        }));

        _this2.network = network;

        _this2.config = {
            isBatchProcess: true
        };

        _this2.createContexts(contexts);
        _this2.createRoutes(routes);
        return _this2;
    }

    /**
     * Stop routing after the first successful route
     */


    _createClass(Router, [{
        key: "matchFirst",
        value: function matchFirst() {
            this.type = EnumRouteType.MatchFirst;

            return this;
        }
        /**
         * Run all routes that match the event
         */

    }, {
        key: "matchAll",
        value: function matchAll() {
            this.type = EnumRouteType.MatchAll;

            return this;
        }

        /**
         * Turn off the batching process and process any event
         *  that comes through as it comes through for *all*
         *  <Context(s)>, including future additions.
         */

    }, {
        key: "useRealTimeProcess",
        value: function useRealTimeProcess() {
            this.config.isBatchProcess = false;

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var context = _step5.value;

                    if (context instanceof _Context2.default) {
                        context.useRealTimeProcess();
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

            return this;
        }
        /**
         * Turn on the batching process for *all* <Context(s)>--
         *  including future additions--and queue *all* events
         *  that get captured. They will be stored in the queue
         *  until << .process() >> is invoked.
         */

    }, {
        key: "useBatchProcess",
        value: function useBatchProcess() {
            this.config.isBatchProcess = true;

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var context = _step6.value;

                    if (context instanceof _Context2.default) {
                        context.useBatchProcess();
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
         * Create a <Context> to which events can be routed
         *  and handled in an isolated scope.
         */

    }, {
        key: "createContext",
        value: function createContext(name) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            var context = new (Function.prototype.bind.apply(_Context2.default, [null].concat([this.network], args)))();

            this.register(context, name);

            if (this.config.isBatchProcess) {
                context.useBatchProcess();
            } else {
                context.useRealTimeProcess();
            }

            return context;
        }
        /**
         * A convenience method to iteratively invoke << createContext >>
         */

    }, {
        key: "createContexts",
        value: function createContexts() {
            var createContextArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var contexts = [];
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = createContextArgs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _step7$value = _toArray(_step7.value),
                        name = _step7$value[0],
                        _args = _step7$value.slice(1);

                    contexts.push(this.createContext.apply(this, [name].concat(_toConsumableArray(_args))));
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

            return contexts;
        }
        /**
         * Remove a <Context> event route
         */

    }, {
        key: "destroyContext",
        value: function destroyContext(nameOrContext) {
            return this.unregister(nameOrContext);
        }
        /**
         * A convenience method to iteratively invoke << destroyContext >>
         */

    }, {
        key: "destroyContexts",
        value: function destroyContexts() {
            var destroyContextArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var results = [];
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = destroyContextArgs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var _step8$value = _toArray(_step8.value),
                        name = _step8$value[0],
                        _args2 = _step8$value.slice(1);

                    results.push(this.destroyContext.apply(this, [name].concat(_toConsumableArray(_args2))));
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

        /**
         * Invoke the << .process >> command on all <Context(s)>
         *  to create a linear execution chain.
         */

    }, {
        key: "process",
        value: function process() {
            var contexts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (contexts.length === 0) {
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = this[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var context = _step9.value;

                        context.process();
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

            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = contexts[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var nameOrContext = _step10.value;

                    var _context = this[nameOrContext];

                    if (_context instanceof _Context2.default) {
                        _context.process();
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

            return this;
        }
        /**
         * Invoke the << .drop >> command on all <Context(s)>
         *  to create a linear execution chain.
         */

    }, {
        key: "empty",
        value: function empty() {
            var contexts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (contexts.length === 0) {
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = this[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var context = _step11.value;

                        context.empty();
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

                return this;
            }

            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = contexts[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var nameOrContext = _step12.value;

                    var _context2 = this[nameOrContext];

                    if (_context2 instanceof _Context2.default) {
                        _context2.empty();
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

            return this;
        }
    }]);

    return Router;
}((0, _helper.compose)(_Registry.$Registry, $Router)(_AgencyBase2.default));

;

exports.default = Router;