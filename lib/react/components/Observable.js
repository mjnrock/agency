"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = Observable;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = require("semantic-ui-react");

var _Observable = require("./../../Observable");

var _Observable2 = _interopRequireDefault(_Observable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Observable(props) {
    var observable = props.observable;

    var _useState = (0, _react.useState)(),
        _useState2 = _slicedToArray(_useState, 2),
        isEditMode = _useState2[0],
        setIsEditMode = _useState2[1];

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
                if (observable[dot] instanceof _Observable2.default) {
                    obj[key] = _react2.default.createElement(Observable, { observable: observable[dot] });
                } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    obj[key] = _react2.default.createElement(
                        _semanticUiReact.Grid,
                        { key: dot, celled: true, padded: true },
                        toDataArray(value, dot).map(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 2),
                                key = _ref2[0],
                                value = _ref2[1];

                            return _react2.default.createElement(
                                _semanticUiReact.Grid.Row,
                                { key: key },
                                _react2.default.createElement(
                                    _semanticUiReact.Grid.Column,
                                    { width: 2 },
                                    key
                                ),
                                _react2.default.createElement(
                                    _semanticUiReact.Grid.Column,
                                    { width: 14 },
                                    value
                                )
                            );
                        })
                    );
                } else {
                    obj[key] = _react2.default.createElement(
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

    function objectToEditJsx(obj, prop, dot) {
        if (!dot) {
            dot = "$";
        }

        var dotprop = dot + "." + prop;
        if (_typeof(obj[prop]) === "object") {
            var jsx = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.entries(obj[prop])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        key = _step2$value[0],
                        value = _step2$value[1];

                    jsx.push(_react2.default.createElement(
                        _semanticUiReact.Grid,
                        { key: key, celled: true },
                        _react2.default.createElement(
                            _semanticUiReact.Grid.Row,
                            { key: key },
                            _react2.default.createElement(
                                _semanticUiReact.Grid.Column,
                                { width: 2 },
                                key
                            ),
                            _react2.default.createElement(
                                _semanticUiReact.Grid.Column,
                                { width: 14 },
                                objectToEditJsx(value, key, dotprop)
                            )
                        )
                    ));
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

            return jsx;
        }

        if (!isNaN(parseFloat(observable[dotprop])) && isFinite(observable[dotprop])) {
            return _react2.default.createElement(_semanticUiReact.Input, {
                type: "number",
                defaultValue: observable[dotprop],
                onChange: function onChange(e) {
                    return observable[dotprop] = parseFloat(e.target.value);
                }
            });
        }

        return _react2.default.createElement(_semanticUiReact.Input, {
            type: "text",
            defaultValue: observable[dotprop],
            onChange: function onChange(e) {
                return observable[dotprop] = e.target.value;
            }
        });
    }

    return _react2.default.createElement(
        _semanticUiReact.Table,
        null,
        _react2.default.createElement(
            _semanticUiReact.Table.Header,
            null,
            _react2.default.createElement(
                _semanticUiReact.Table.Row,
                null,
                _react2.default.createElement(
                    _semanticUiReact.Table.HeaderCell,
                    null,
                    "Key"
                ),
                _react2.default.createElement(
                    _semanticUiReact.Table.HeaderCell,
                    null,
                    "Value"
                )
            )
        ),
        _react2.default.createElement(
            _semanticUiReact.Table.Body,
            null,
            _react2.default.createElement(
                _semanticUiReact.Table.Row,
                null,
                _react2.default.createElement(
                    _semanticUiReact.Table.Cell,
                    null,
                    "__id"
                ),
                _react2.default.createElement(
                    _semanticUiReact.Table.Cell,
                    null,
                    observable.__id
                )
            ),
            toDataArray(data).map(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    key = _ref4[0],
                    jsx = _ref4[1];

                return _react2.default.createElement(
                    _semanticUiReact.Table.Row,
                    { key: key },
                    _react2.default.createElement(
                        _semanticUiReact.Table.Cell,
                        { key: key + "-1" },
                        key
                    ),
                    isEditMode === key ? _react2.default.createElement(
                        _semanticUiReact.Table.Cell,
                        {
                            key: key + "-2",
                            onBlur: function onBlur(e) {
                                setIsEditMode(null);
                            },
                            onKeyPress: function onKeyPress(e) {
                                if (e.which === 13) {
                                    setIsEditMode(null);
                                }
                            }
                        },
                        objectToEditJsx(data, key)
                    ) : _react2.default.createElement(
                        _semanticUiReact.Table.Cell,
                        {
                            key: key + "-2",
                            onClick: function onClick(e) {
                                setIsEditMode(key);
                            }
                        },
                        jsx
                    )
                );
            })
        )
    );
};