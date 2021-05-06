"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable */


exports.useNetwork = useNetwork;

var _react = require("react");

var _Network = require("./../event/Network");

var _Network2 = _interopRequireDefault(_Network);

var _Dispatcher = require("./../event/Dispatcher");

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

var _Context = require("./../event/Context");

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useNetwork(network) {
    var contexts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["default"];
    var emitter = arguments[2];

    var _useState = (0, _react.useState)(function () {
        return network.getState();
    }),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    var _useState3 = (0, _react.useState)(function () {
        return new _Dispatcher2.default(network, emitter || network);
    }),
        _useState4 = _slicedToArray(_useState3, 2),
        dispatcher = _useState4[0],
        setDispatcher = _useState4[1];

    (0, _react.useEffect)(function () {
        if (emitter && dispatcher.subject !== emitter) {
            setDispatcher(new _Dispatcher2.default(network, emitter));
        }
    }, [emitter]);

    (0, _react.useEffect)(function () {
        // const handler = function([ state, oldState, changes ]) {
        var handler = function handler(_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                state = _ref2[0];

            setState(state);
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = contexts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var context = _step.value;

                if (context instanceof _Context2.default) {
                    context.addHandler(_Network2.default.Signals.UPDATE, handler);
                } else {
                    var ctx = network.router[context];

                    if (ctx instanceof _Context2.default) {
                        ctx.addHandler(_Network2.default.Signals.UPDATE, handler);
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

        return function () {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = contexts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var context = _step2.value;

                    if (context instanceof _Context2.default) {
                        context.removeHandler(_Network2.default.Signals.UPDATE, handler);
                    } else {
                        var ctx = network.router[context];

                        if (ctx instanceof _Context2.default) {
                            ctx.removeHandler(_Network2.default.Signals.UPDATE, handler);
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
        };
    }, [network, contexts]);

    return [state, dispatcher.dispatch, dispatcher.broadcast];
};

exports.default = {
    useNetwork: useNetwork
};