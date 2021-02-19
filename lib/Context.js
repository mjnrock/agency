"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _os = require("os");

var _uuid = require("uuid");

var _Mutator = require("./Mutator");

var _Mutator2 = _interopRequireDefault(_Mutator);

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * :update | (state, isMutatorUpdate)
 *      Non-Mutator updates occur if state is set directly (i.e. state[ prop ] = value)
 */

var Context = function (_EventEmitter) {
    _inherits(Context, _EventEmitter);

    /**
     * OVERLOADS
     * (state = {}, evaluators = [ ...[ <Mutator>|fn, ...Array<<Proposition>|fn> ] ])
     * (state = {}, <Mutator>|fn)
     */
    function Context() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ret;

        var evaluators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Context);

        var _this = _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).call(this));

        _this._id = (0, _uuid.v4)();
        _this._state = state;
        _this._evaluators = new Map();

        if (typeof evaluators === "function" || evaluators instanceof _Mutator2.default) {
            _this.attach(evaluators);
        } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = evaluators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _toArray(_step.value),
                        mutator = _step$value[0],
                        propositions = _step$value.slice(1);

                    _this.attach.apply(_this, [mutator].concat(_toConsumableArray(propositions)));
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
        }

        return _ret = new Proxy(_this, {
            get: function get(target, prop, receiver) {
                if (prop in (target._state || {})) {
                    return target._state[prop];
                }

                return Reflect.get.apply(Reflect, arguments);
            },
            set: function set(target, prop, value) {
                if (prop in (target._state || {})) {
                    target._state[prop] = value;

                    target.emit("update", target._state, false);
                }

                return Reflect.set.apply(Reflect, arguments);
            }
        }), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Context, [{
        key: "attach",
        value: function attach(mutator) {
            if (Array.isArray(mutator)) {
                if (mutator.every(function (m) {
                    return typeof m === "function";
                })) {
                    mutator = new (Function.prototype.bind.apply(_Mutator2.default, [null].concat(_toConsumableArray(mutator))))();
                } else {
                    throw new Error("@mutator as an <Array> may only contain |function|");
                }
            } else if (typeof mutator === "function") {
                mutator = new _Mutator2.default(mutator);
            }

            if (!(mutator instanceof _Mutator2.default)) {
                throw new Error("@mutator must be a <Mutator>, a |function|, or Array<function>");
            }

            for (var _len = arguments.length, propositions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                propositions[_key - 1] = arguments[_key];
            }

            if (propositions.length === 1) {
                if (propositions[0] instanceof _Proposition2.default) {
                    this._evaluators.set(mutator, [propositions[0]]);
                } else if (typeof propositions[0] === "function") {
                    this._evaluators.set(mutator, [new _Proposition2.default(propositions[0])]);
                } else {
                    throw new Error("All @propositions must be either a <Proposition> or a |function|");
                }
            } else {
                var props = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = propositions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var proposition = _step2.value;

                        if (proposition instanceof _Proposition2.default) {
                            props.push(proposition);
                        } else if (typeof proposition === "function") {
                            props.push(new _Proposition2.default(proposition));
                        } else {
                            throw new Error("All @propositions must be either a <Proposition> or a |function|");
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

                this._evaluators.set(mutator, props);
            }

            return mutator;
        }
    }, {
        key: "detach",
        value: function detach(mutator) {
            return this._evaluators.delete(mutator);
        }

        // <Context> is vacuously true, if no propositions are connected to a given <Mutator>
        // In the case where @args looks like a Redux message (object with "type"), add it to the mutator params

    }, {
        key: "run",
        value: function run() {
            var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            for (var _len2 = arguments.length, mutatorArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                mutatorArgs[_key2 - 1] = arguments[_key2];
            }

            var mutArgs = mutatorArgs;
            if (!Array.isArray(args)) {
                if ((typeof args === "undefined" ? "undefined" : _typeof(args)) === "object" && "type" in args) {
                    mutArgs = [args].concat(_toConsumableArray(mutArgs));
                }

                args = [args];
            }

            var tests = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._evaluators.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = _slicedToArray(_step3.value, 2),
                        mutator = _step3$value[0],
                        props = _step3$value[1];

                    if (props.length === 0 || props.every(function (prop) {
                        return prop.run.apply(prop, _toConsumableArray(args)) === true;
                    })) {
                        this._state = mutator.mutate.apply(mutator, [this._state].concat(_toConsumableArray(mutArgs)));

                        tests.push(true);
                    } else {
                        tests.push(false);
                    }
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

            this.emit("update", this._state, true);

            return tests.some(function (t) {
                return t === true;
            });
        }

        //! These are named according to their React convenience functionality, and thus are NOT named consistently with <Context> terms
        //  Convenience functions if using this with React
        /**
         * This mutator will activate if a <String> @type matches OR if an object containing a matching "type" prop (e.g. { type: @type, ... })
         */

    }, {
        key: "addReducer",
        value: function addReducer(type, fn) {
            return this.attach(fn, new _Proposition2.default(_Proposition2.default.IsType(type), _Proposition2.default.IsMessageType(type)));
        }
        /**
         * OVERLOADS
         * (type, data, ...args) | The type-data paradigm
         * ({ type, data, ... }, ...args) | The message-/event-object paradigm
         */

    }, {
        key: "dispatch",
        value: function dispatch() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            if (typeof args[0] === "string" || args[0] instanceof String) {
                return this.run.apply(this, [[args[0]], { type: args[0], data: args[1] }].concat(_toConsumableArray(args.slice(2))));
            } else if (_typeof(args[0]) === "object") {
                return this.run.apply(this, [[args[0]]].concat(args));
            }

            return false;
        }
    }, {
        key: "state",
        get: function get() {
            return _extends({}, this._state);
        }
    }]);

    return Context;
}(_events2.default);

exports.default = Context;
;

//* Synonymous Usage Examples
// //* Ex. 1
// const ctx = new Context({
//     cats: 2,
// }, [
//     [
//         state => ({
//             ...state,
//             _now: Date.now(),
//         }),
//         (...args) => {
//             console.log(...args);

//             return true;
//         }
//     ]
// ]);

// //* Ex. 2
// const ctx = new Context({
//     cats: 2,
// });
// ctx.attach(
//     state => ({
//         ...state,
//         _now: Date.now(),
//     }),
//     (...args) => {
//         console.log(...args);

//         return true;
//     }
// );

// //* Ex. 3
// const ctx = new Context({
//     cats: 2,
// });
// ctx.attach(
//     new Mutator(state => ({
//         ...state,
//         _now: Date.now(),
//     })),
//     new Proposition((...args) => {
//         console.log(...args);

//         return true;
//     })
// );