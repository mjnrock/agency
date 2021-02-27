"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Observer;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Observable = require("./../../Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _Observer = require("./../../Observer");

var _Observer2 = _interopRequireDefault(_Observer);

var _Observable3 = require("./Observable");

var _Observable4 = _interopRequireDefault(_Observable3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Observer(props) {
    var observer = props.observer;


    var children = [];
    if (observer.subject instanceof _Observable2.default) {
        children.push(_react2.default.createElement(_Observable4.default, {
            key: observer.__id,
            observable: observer.subject
        }));
    } else if (observer.subject instanceof _Observer2.default) {
        children.push(_react2.default.createElement(Observer, {
            key: observer.__id,
            observer: observer.subject
        }));
    }

    return _react2.default.createElement(
        _react.Fragment,
        null,
        children
    );
};