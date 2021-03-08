"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Observable = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;
exports.Wrap = Wrap;

var _uuid = require("uuid");

var _Mutator = require("./Mutator");

var _Mutator2 = _interopRequireDefault(_Mutator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO Consider merging to a scheme with syntactic naming
/**
 * These would all affect how .toData() and .next() process them
 * `${ var }`    | public variable: [ next, toData, toDetail ]
 * `$${ var }`   | meta variable: [ next, toDetail ]
 * `__${ var }`  | private variable: [ toDetail ]
 */

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

        //TODO  Object.getOwnPropertyDescriptor(object1, 'property1').get/.set to check if is a getter/setter and thus ignore
        return new Proxy(this, {
            get: function get(target, prop) {
                if ((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    var props = prop.split(".");

                    if (props[0] === "$") {
                        props = props.slice(1);
                    }

                    var result = target;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var p = _step.value;

                            if (result[p] !== void 0) {
                                result = result[p];
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

                    return result;
                }

                return target[prop];
            },
            set: function set(target, prop, value) {
                if ((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    var props = prop.split(".");

                    if (props[0] === "$") {
                        props = props.slice(1);
                    }

                    var result = target;
                    for (var i = 0; i < props.length; i++) {
                        var p = props[i];

                        if (i < props.length - 1) {
                            result = result[p];
                        } else {
                            result[p] = value;

                            target.next(prop, result[p]);
                        }
                    }

                    return this;
                }

                if (Array.isArray(value)) {
                    target[prop] = value;
                } else if (deep && ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" || value instanceof Observable)) {
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


        /**
         * For the most part, this is sufficient for only grabbing custom functions and ignoring property methods
         *      That being said, override in ancestor if issues arise
         */
        value: function toData() {
            var obj = {};

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.entries(this)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        key = _step2$value[0],
                        value = _step2$value[1];

                    if (key[0] !== "_" || key[0] === "_" && key[1] !== "_") {
                        if (value instanceof Observable) {
                            obj[key] = value.toData();
                        } else {
                            obj[key] = value;
                        }
                    }
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

            return obj;
        }
    }, {
        key: "next",
        get: function get() {
            if (typeof this.__next === "function" || this.__next instanceof _Mutator2.default) {
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
            } else if (fn instanceof _Mutator2.default) {
                this.__next = function () {
                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    return new Promise(function (resolve, reject) {
                        resolve(fn.process.apply(fn, args));
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

    // if(state instanceof Observable) {
    //     state = state.toData();
    // }

    if ((typeof state === "undefined" ? "undefined" : _typeof(state)) === "object" || state instanceof Observable) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Object.entries(state)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _step3$value = _slicedToArray(_step3.value, 2),
                    key = _step3$value[0],
                    value = _step3$value[1];

                obs[key] = value;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }

    return obs;
};

//FIXME This is still mostly a work in progress, as it doesn't yet do what it's meant to
function Wrap() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new Proxy(obj, {
        get: function get(target, prop) {
            return target[prop];
        },
        set: function set(target, prop, value) {
            target[prop] = value;

            if (typeof target.next === "function") {
                target.next(prop, target[prop]);
            } else if (target.next instanceof _Mutator2.default) {
                target.next.process(prop, target[prop]);
            }

            return target;
        }
    });
};

Observable.Factory = Factory;
// Observable.Wrap = Wrap;

exports.default = Observable;