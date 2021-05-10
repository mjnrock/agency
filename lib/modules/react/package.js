"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable */


exports.useNetwork = useNetwork;

var _react = require("react");

var _Network = require("../../event/Network");

var _Network2 = _interopRequireDefault(_Network);

var _ReactNetwork = require("./ReactNetwork");

var _ReactNetwork2 = _interopRequireDefault(_ReactNetwork);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useNetwork(network) {
    var _useState = (0, _react.useState)(function () {
        return network.state;
    }),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    var _useState3 = (0, _react.useState)(function () {
        return new Dispatcher(network.network, network.network);
    }),
        _useState4 = _slicedToArray(_useState3, 1),
        dispatcher = _useState4[0];

    (0, _react.useEffect)(function () {
        var handler = function handler(_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                state = _ref2[0];

            setState(state);
        };

        network.getChannel("_internal").addHandler(_Network2.default.Signals.UPDATE, handler);

        return function () {
            network.getChannel("_internal").removeHandler(_Network2.default.Signals.UPDATE, handler);
        };
    }, []);

    return [state, dispatcher.dispatch, dispatcher.broadcast];
};

exports.default = {
    useNetwork: useNetwork,

    ReactNetwork: _ReactNetwork2.default
};