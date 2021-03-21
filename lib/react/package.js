"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useWatchable = useWatchable;

var _react = require("react");

var _Watcher = require("./../Watcher");

var _Watcher2 = _interopRequireDefault(_Watcher);

var _Watchable = require("./../Watchable");

var _Watchable2 = _interopRequireDefault(_Watchable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function useWatchable(context, prop) {
    var ctx = (0, _react.useContext)(context);
    var subject = prop ? ctx[prop] : ctx;

    var _useState = (0, _react.useState)(new _Watcher2.default([subject])),
        _useState2 = _slicedToArray(_useState, 2),
        watcher = _useState2[0],
        setWatcher = _useState2[1];

    var _useState3 = (0, _react.useState)(subject instanceof _Watchable2.default ? subject.toData() : {}),
        _useState4 = _slicedToArray(_useState3, 2),
        data = _useState4[0],
        setData = _useState4[1];

    (0, _react.useEffect)(function () {
        var fn = function fn(prop, value) {
            if (subject) {
                setData(_extends({}, data, _defineProperty({}, prop, value)));
            }
        };

        watcher.$.subscribe(fn);

        return function () {
            watcher.$.unsubscribe(fn);
            setWatcher(null);
        };
    }, [subject]);

    return { data: data, subject: subject, watcher: watcher };
};

exports.default = {
    useWatchable: useWatchable
};