"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = Observable;

var _semanticUiReact = require("semantic-ui-react");

function Observable(props) {
    var observable = props.observable;


    var data = JSON.parse(JSON.stringify(observable.toData()));

    function toDataArray(data) {
        var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "$";

        var obj = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2),
                    key = _step$value[0],
                    value = _step$value[1];

                var dot = prop + "." + key;
                if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    obj[key] = React.createElement(
                        _semanticUiReact.Grid,
                        { key: dot },
                        toDataArray(value, dot).map(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 2),
                                key = _ref2[0],
                                value = _ref2[1];

                            return React.createElement(
                                _semanticUiReact.Grid.Row,
                                { key: key },
                                React.createElement(
                                    _semanticUiReact.Grid.Column,
                                    null,
                                    key
                                ),
                                React.createElement(
                                    _semanticUiReact.Grid.Column,
                                    null,
                                    value
                                )
                            );
                        })
                    );
                } else {
                    obj[key] = React.createElement(
                        "div",
                        { key: dot },
                        value
                    );
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

        return Object.entries(obj);
    }

    return React.createElement(
        _semanticUiReact.Table,
        null,
        React.createElement(
            _semanticUiReact.Table.Header,
            null,
            React.createElement(
                _semanticUiReact.Table.Row,
                null,
                React.createElement(
                    _semanticUiReact.Table.HeaderCell,
                    null,
                    "Key"
                ),
                React.createElement(
                    _semanticUiReact.Table.HeaderCell,
                    null,
                    "Value"
                )
            )
        ),
        React.createElement(
            _semanticUiReact.Table.Body,
            null,
            React.createElement(
                _semanticUiReact.Table.Row,
                null,
                React.createElement(
                    _semanticUiReact.Table.Cell,
                    null,
                    "__id"
                ),
                React.createElement(
                    _semanticUiReact.Table.Cell,
                    null,
                    observable.__id
                )
            ),
            toDataArray(data).map(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    key = _ref4[0],
                    value = _ref4[1];

                return React.createElement(
                    _semanticUiReact.Table.Row,
                    { key: key },
                    React.createElement(
                        _semanticUiReact.Table.Cell,
                        { key: key + "-1" },
                        key
                    ),
                    React.createElement(
                        _semanticUiReact.Table.Cell,
                        { key: key + "-2" },
                        value
                    )
                );
            })
        )
    );
};