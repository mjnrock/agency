"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Network = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Emitter = require("./Emitter");

var _Emitter2 = _interopRequireDefault(_Emitter);

var _Watcher2 = require("./Watcher");

var _Watcher3 = _interopRequireDefault(_Watcher2);

var _Registry = require("./Registry");

var _Registry2 = _interopRequireDefault(_Registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Network = exports.Network = function (_Watcher) {
    _inherits(Network, _Watcher);

    /**
     * @parentKey will be inserted via Reflect.defineProperty into the emitter on .join--as an internal property (i.e. `__${ parentKey }`)--and removed on .leave
     */
    function Network() {
        var _this2$$;

        var emitters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref$parentKey = _ref.parentKey,
            parentKey = _ref$parentKey === undefined ? "network" : _ref$parentKey,
            opts = _objectWithoutProperties(_ref, ["parentKey"]);

        _classCallCheck(this, Network);

        var _this2 = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, [], _extends({}, opts)));

        _this2.__parentKey = parentKey;

        _this2.emitters = new _Registry2.default();
        (_this2$$ = _this2.$).join.apply(_this2$$, _toConsumableArray(emitters));
        return _this2;
    }

    _createClass(Network, [{
        key: "$",
        get: function get() {
            var _this = this;
            var _broadcast = _get(Network.prototype.__proto__ || Object.getPrototypeOf(Network.prototype), "$", this).broadcast;

            var obj = _extends({}, _get(Network.prototype.__proto__ || Object.getPrototypeOf(Network.prototype), "$", this), {

                /**
                 * Prepend the namespace, if it exists, and eliminate redundant wrapping in nested <Network(s)>.
                 */
                broadcast: async function broadcast(prop, value) {
                    if (typeof _this.__namespace === "string" && _this.__namespace.length || _this.__namespace === Infinity) {
                        var regex = new RegExp("(" + _this.__namespace + ".)+", "i");
                        var newProp = (_this.__namespace + "." + prop).replace(regex, _this.__namespace + ".");

                        return _broadcast.call(this, newProp, value);
                    }

                    return _broadcast.call(this, prop, value);
                },
                join: function join(emitter) {
                    if (emitter instanceof _Emitter2.default) {
                        var _this$emitters$$;

                        for (var _len = arguments.length, synonyms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            synonyms[_key - 1] = arguments[_key];
                        }

                        (_this$emitters$$ = _this.emitters.$).register.apply(_this$emitters$$, [emitter].concat(synonyms));

                        _this.$.watch(emitter);

                        Reflect.defineProperty(emitter, _this.__parentKey, {
                            configurable: true,
                            get: function get() {
                                return Reflect.get(_this, "__" + _this.__parentKey);
                            },
                            set: function set(value) {
                                return Reflect.set(_this, "__" + _this.__parentKey, value);
                            }
                        });
                        emitter[_this.__parentKey] = _this;
                    }

                    return _this;
                },
                leave: function leave() {
                    var bools = [];

                    for (var _len2 = arguments.length, emitters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        emitters[_key2] = arguments[_key2];
                    }

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = emitters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var emitter = _step.value;

                            if (emitter instanceof _Emitter2.default) {
                                var bool = _this.emitters.$.unregister(emitter).length;

                                if (bool) {
                                    _this.$.unwatch(emitter);

                                    Reflect.deleteProperty(emitter, "__" + _this.__parentKey); // Delete the value
                                    Reflect.deleteProperty(emitter, _this.__parentKey); // Delete the trap--will get recreated if emitter rejoins a <${ _this.__parentKey }>
                                }

                                bools.push(bool);
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

                    if (bools.length === 1) {
                        return bools[0];
                    }

                    return bools;
                },


                /**
                 * Due to the nature of <Emitter>, if an emitter does not contain
                 *      the @event, then it will not emit it.  This behavior can
                 *      be exploited to create de facto groups based on the presence
                 *      or absence of an event within a given emitter, and invoke
                 *      those groups collectively here.
                 */
                fire: function fire(event) {
                    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                        args[_key3 - 1] = arguments[_key3];
                    }

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _this.emitters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _emitter$$;

                            var emitter = _step2.value;

                            (_emitter$$ = emitter.$).emit.apply(_emitter$$, [event].concat(args));
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

                    return _this;
                },


                /**
                 * @param {string} event | The event name
                 * @param {fn} argsFn | .$event(...args) finalizes as .broadcast(event, argsFn(...args))
                 * @param {fn} filter | A selector function that filters which of this.emitters will have the new event added
                 */
                attachEvent: function attachEvent(event) {
                    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                        argsFn = _ref2.argsFn,
                        filter = _ref2.filter;

                    var emitters = typeof filter === "function" ? filter(_this.emitters) : _this.emitters;

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = emitters[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var emitter = _step3.value;

                            if (typeof argsFn === "function") {
                                emitter.$.addEvent(event, argsFn);
                            } else {
                                emitter.$.handle(event);
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

                    return _this;
                },
                detatchEvent: function detatchEvent() {
                    for (var _len4 = arguments.length, events = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        events[_key4] = arguments[_key4];
                    }

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = _this.emitters[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var emitter = _step4.value;
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = events[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var event = _step5.value;

                                    emitter.$.removeEvent(event);
                                }
                            } catch (err) {
                                _didIteratorError5 = true;
                                _iteratorError5 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                        _iterator5.return();
                                    }
                                } finally {
                                    if (_didIteratorError5) {
                                        throw _iteratorError5;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    return _this;
                }
            });

            obj.bulkJoin = function () {
                var joinArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = joinArgs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _step6$value = _toArray(_step6.value),
                            emitter = _step6$value[0],
                            _synonyms = _step6$value.slice(1);

                        obj.join.apply(obj, [emitter].concat(_toConsumableArray(_synonyms)));
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                return _this;
            };
            /**
             * @param {[ event, { argsFn, filter }]} addEventArgs | This should have one array row per intended .addEvent call
             */
            obj.bulkAttachEvent = function () {
                var addEventArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = addEventArgs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var _step7$value = _slicedToArray(_step7.value, 2),
                            event = _step7$value[0],
                            opts = _step7$value[1];

                        obj.attachEvent(event, opts);
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                return _this;
            };

            return obj;
        }
    }]);

    return Network;
}(_Watcher3.default);

;

exports.default = Network;