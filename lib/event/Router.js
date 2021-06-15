"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = exports.Router = function () {
    function Router(bus) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            type = _ref.type,
            _ref$routes = _ref.routes,
            routes = _ref$routes === undefined ? [] : _ref$routes;

        _classCallCheck(this, Router);

        this.bus = bus;
        this.type = type || Router.RuleType.MatchFirst;

        this.routes = new Set();
        this.createRoutes(routes);
    }

    /**
     * Stop routing after the first successful route
     */


    _createClass(Router, [{
        key: "matchFirst",
        value: function matchFirst() {
            this.type = Router.RuleType.MatchFirst;

            return this;
        }
        /**
         * Run all routes that match the event
         */

    }, {
        key: "matchAll",
        value: function matchAll() {
            this.type = Router.RuleType.MatchAll;

            return this;
        }
    }, {
        key: "route",
        value: function route(message) {
            var hasResult = false;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var fn = _step.value;

                    var routes = fn(message);

                    if (!Array.isArray(routes)) {
                        routes = [routes];
                    }

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = routes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var route = _step2.value;

                            var channel = route;

                            if (typeof route === "string" || route instanceof String) {
                                channel = this.bus.channels[route];
                            }

                            if (channel instanceof _Channel2.default) {
                                channel.bus(message);

                                hasResult = true;
                            } else if (typeof channel === "function") {
                                channel(message);
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

                    if (hasResult && this.type === Router.RuleType.MatchFirst) {
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
        }
    }, {
        key: "createRoute",
        value: function createRoute(filterFn) {
            if (typeof filterFn === "function") {
                this.routes.add(filterFn);
            }

            return this;
        }
    }, {
        key: "createRoutes",
        value: function createRoutes() {
            var createRouteArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = createRouteArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var args = _step3.value;

                    this.createRoute.apply(this, _toConsumableArray(args));
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
                return this.routes.delete(filterFn);
            }

            return false;
        }
    }, {
        key: "destroyRoutes",
        value: function destroyRoutes() {
            var destroyRouteArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var results = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = destroyRouteArgs.map(function (v) {
                    return Array.isArray(v) ? v : [v];
                })[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var args = _step4.value;

                    results.push(this.destroyRoute.apply(this, _toConsumableArray(args)));
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

    return Router;
}();

Router.RuleType = {
    MatchFirst: 1,
    MatchAll: 2
};
;

exports.default = Router;