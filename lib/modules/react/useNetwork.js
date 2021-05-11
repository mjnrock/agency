"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useNetwork = useNetwork;
exports.useContextNetwork = useContextNetwork;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Network = require("../../event/Network");

var _Network2 = _interopRequireDefault(_Network);

var _Dispatcher = require("../../event/Dispatcher");

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a React Hook that will get the state of the passed network
 *  and return it, along with a dispatcher attached to that same network,
 *  using the network as its subject.
 */
function useNetwork(network) {
    var _useState = (0, _react.useState)(function () {
        return network.state;
    }),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    var _useState3 = (0, _react.useState)(function () {
        return new _Dispatcher2.default(network, network);
    }),
        _useState4 = _slicedToArray(_useState3, 1),
        dispatcher = _useState4[0];

    (0, _react.useEffect)(function () {
        var handler = function handler(_ref) {
            var data = _ref.data;

            var _data = _slicedToArray(data, 1),
                newState = _data[0];

            setState(newState);
        };

        network.getChannel("_internal").addHandler(_Network2.default.Signal.UPDATE, handler);

        return function () {
            network.getChannel("_internal").removeHandler(_Network2.default.Signal.UPDATE, handler);
        };
    }, [network]);

    return {
        state: state,
        dispatch: dispatcher.dispatch,
        broadcast: dispatcher.broadcast
    };
};

/**
 * A wrapper for << useNetwork >> for cases where the network resides within
 *  a React Context.  @prop can be used with dot notation to grab a nested value.
 */
function useContextNetwork(context) {
    var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "network";

    var ctx = (0, _react.useContext)(context);

    var nested = prop.split("."),
        network = ctx;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = nested[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            network = network[p];
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

    return useNetwork(network);
};

exports.default = {
    useNetwork: useNetwork,
    useContextNetwork: useContextNetwork
};