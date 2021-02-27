"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = Beacon;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Observable = require("./../../Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _Observer = require("./../../Observer");

var _Observer2 = _interopRequireDefault(_Observer);

var _Observer3 = require("./Observer");

var _Observer4 = _interopRequireDefault(_Observer3);

var _Observable3 = require("./Observable");

var _Observable4 = _interopRequireDefault(_Observable3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Beacon(props) {
    var beacon = props.beacon;


    if (!beacon) {
        return null;
    }

    var members = [].concat(_toConsumableArray(beacon.members.entries())).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            member = _ref2[1].member;

        if (member instanceof _Observable2.default) {
            return _react2.default.createElement(_Observable4.default, {
                key: member.__id,
                observable: member
            });
        } else if (member instanceof _Observer2.default) {
            return _react2.default.createElement(_Observer4.default, {
                key: member.__id,
                observer: member
            });
        }

        return null;
    });

    return _react2.default.createElement(
        _react.Fragment,
        null,
        members
    );
};