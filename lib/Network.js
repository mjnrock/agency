"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Network = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emitter = require("./Emitter");

var _Emitter2 = _interopRequireDefault(_Emitter);

var _Watcher2 = require("./Watcher");

var _Watcher3 = _interopRequireDefault(_Watcher2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Network = exports.Network = function (_Watcher) {
    _inherits(Network, _Watcher);

    /**
     * @parentKey will be inserted via Reflect.defineProperty into the entity on .join--as an internal property (i.e. `__${ parentKey }`)--and removed on .leave
     */
    function Network() {
        var entities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref$events = _ref.events,
            events = _ref$events === undefined ? [] : _ref$events,
            _ref$handlers = _ref.handlers,
            handlers = _ref$handlers === undefined ? [] : _ref$handlers,
            _ref$parentKey = _ref.parentKey,
            parentKey = _ref$parentKey === undefined ? "network" : _ref$parentKey,
            opts = _objectWithoutProperties(_ref, ["events", "handlers", "parentKey"]);

        _classCallCheck(this, Network);

        var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, handlers, _extends({ events: [].concat(_toConsumableArray(Network.Events), _toConsumableArray(events)) }, opts)));

        _this.__parentKey = parentKey;

        _this.entities = new Set();
        _this.join.apply(_this, _toConsumableArray(entities));
        return _this;
    }

    _createClass(Network, [{
        key: "join",
        value: function join() {
            for (var _len = arguments.length, entities = Array(_len), _key = 0; _key < _len; _key++) {
                entities[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = entities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entity = _step.value;

                    if (entity instanceof _Emitter2.default) {
                        this.entities.add(entity);

                        entity.$.subscribe(this);

                        Reflect.defineProperty(entity, this.__parentKey, {
                            configurable: true,
                            get: function get() {
                                return Reflect.get(this, "__" + this.__parentKey);
                            },
                            set: function set(value) {
                                return Reflect.set(this, "__" + this.__parentKey, value);
                            }
                        });
                        entity[this.__parentKey] = this;

                        this.$join(entity);
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

            return this;
        }
    }, {
        key: "leave",
        value: function leave() {
            var bools = [];

            for (var _len2 = arguments.length, entities = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                entities[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = entities[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var entity = _step2.value;

                    if (entity instanceof _Emitter2.default) {
                        var bool = this.entities.delete(entity);

                        if (bool) {
                            entity.$.unsubscribe(this);

                            Reflect.deleteProperty(entity, "__" + this.__parentKey); // Delete the value
                            Reflect.deleteProperty(entity, this.__parentKey); // Delete the trap--will get recreated if entity rejoins a <${ this.__parentKey }>

                            this.$leave(entity);
                        }

                        bools.push(bool);
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

            if (bools.length === 1) {
                return bools[0];
            }

            return bools;
        }
    }, {
        key: "fire",
        value: function fire(event) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.entities[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _entity$$;

                    var entity = _step3.value;

                    (_entity$$ = entity.$).emit.apply(_entity$$, [event].concat(args));
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
    }, {
        key: "values",
        get: function get() {
            return [].concat(_toConsumableArray(this.entities));
        }
    }, {
        key: "size",
        get: function get() {
            return this.entities.size;
        }
    }]);

    return Network;
}(_Watcher3.default);

Network.Events = ["join", "leave"];
;

exports.default = Network;