"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Observable = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;

var _uuid = require("uuid");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The <Observable> is basically just a watchable <Object>
 *      and should basically always be used with an <Observer>
 * .next will provide direct access to updates, while an <Observer> will emit
 *      each prop change as an eponymously named event, as well as a "next" event
 *      as a catch-all
 * Nesting an <Observable> will result in a reassignment of its .next
 *      As such, the .next cannot be nested and be watched *directly*
 *      Use either by a parent <Observable> nesting it, or by an <Observer> watching it, but not both.
 */
//? Only watch events at the root <Observable>, to avoid losing <Observer> bindings
//?     All updates will get bubbled into a .next(dot-notation-prop, value) invocation
var Observable = exports.Observable = function () {
    function Observable() {
        var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$noWrap = _ref.noWrap,
            noWrap = _ref$noWrap === undefined ? false : _ref$noWrap;

        _classCallCheck(this, Observable);

        this.__id = (0, _uuid.v4)();

        if (noWrap) {
            return this;
        }

        return new Proxy(this, {
            get: function get(target, prop) {
                return target[prop];
            },
            set: function set(target, prop, value) {
                if (deep && ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" || value instanceof Observable)) {
                    var ob = value instanceof Observable ? value : Factory(value);
                    ob.next = function () {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        var props = [prop].concat(_toConsumableArray(args.slice(0, args.length - 1))).join(".");

                        target.next(props, args.pop());
                    };

                    target[prop] = ob;
                } else {
                    target[prop] = value;
                }

                target.next(prop, target[prop]);

                return target;
            }
        });
    }

    _createClass(Observable, [{
        key: "toData",
        value: function toData() {
            var obj = {};

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(this)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    if (key[0] !== "_" || key[0] === "_" && key[1] !== "_") {
                        if (value instanceof Observable) {
                            obj[key] = value.toData();
                        } else {
                            obj[key] = value;
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

            return obj;
        }
    }, {
        key: "next",
        get: function get() {
            if (typeof this.__next === "function") {
                return this.__next;
            }

            return function () {};
        },
        set: function set(fn) {
            if (typeof fn === "function") {
                this.__next = function () {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    return new Promise(function (resolve, reject) {
                        resolve(fn.apply(undefined, args));
                    });
                };
            }

            return this;
        }
    }]);

    return Observable;
}();

;

//? Use the .Factory method to create a <Observable> with default state
function Factory() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isDeep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var obs = new Observable(isDeep);

    if (state instanceof Observable) {
        state = state.toData();
    }

    if ((typeof state === "undefined" ? "undefined" : _typeof(state)) === "object") {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.entries(state)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    key = _step2$value[0],
                    value = _step2$value[1];

                obs[key] = value;
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
    }

    return obs;
};

Observable.Factory = Factory;

exports.default = Observable;