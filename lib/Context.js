"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

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

var Context = function (_EventEmitter) {
    _inherits(Context, _EventEmitter);

    /**
     * OVERLOADS
     * (state = {}, evaluators = [ ...[ <Mutator>|fn, ...Array<<Proposition>|fn> ] ])
     * (state = {}, <Mutator>|fn)
     */
    function Context() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
        return _this;
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

    }, {
        key: "run",
        value: function run() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._evaluators.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = _slicedToArray(_step3.value, 2),
                        mutator = _step3$value[0],
                        props = _step3$value[1];

                    if (props.length === 0 || props.every(function (prop) {
                        return prop.run.apply(prop, args) === true;
                    })) {
                        this._state = mutator.mutate(this._state);
                    } else {
                        return false;
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

            this.emit("update", this.state);

            return true;
        }
    }, {
        key: "state",
        get: function get() {
            return JSON.parse(JSON.stringify(this._state));
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