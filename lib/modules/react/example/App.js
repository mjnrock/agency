"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Context = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _ReactNetwork = require("./../ReactNetwork");

var _ReactNetwork2 = _interopRequireDefault(_ReactNetwork);

var _useNetwork = require("./../useNetwork");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Context = exports.Context = _react2.default.createContext();

var network = new _ReactNetwork2.default({
    cats: 54
});

function App() {
    // const { state, dispatch } = useNetwork(network);

    return _react2.default.createElement(
        Context.Provider,
        { value: { testProp: { n1: { n2: network } } } },
        _react2.default.createElement(Comp, null)
    );
};

function Comp() {
    var _useContextNetwork = (0, _useNetwork.useContextNetwork)(Context, "testProp.n1.n2"),
        state = _useContextNetwork.state,
        dispatch = _useContextNetwork.dispatch;
    // const { state, dispatch } = useContextNetwork(Context, "testProp");

    // console.log(state)

    return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
            "div",
            null,
            JSON.stringify(state)
        )
    );
}

exports.default = App;