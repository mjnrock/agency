"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useObserver = useObserver;

var _Observer = require("./Observer");

var _Observer2 = _interopRequireDefault(_Observer);

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function useObserver(context, prop) {
    var observable = (0, _react.useContext)(context);

    var _useState = (0, _react.useState)({}),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    (0, _react.useEffect)(function () {
        var fn = function fn(prop, value) {
            setState(_extends({}, state, _defineProperty({}, prop, value)));
        };

        var ob = prop ? observable[prop] : observable;
        var obs = new _Observer2.default(ob);
        obs.on("next", fn);

        return function () {
            obs.off("next", fn);
            obs = null;
        };
    }, []);

    return state;
};

exports.default = {
    useObserver: useObserver
};