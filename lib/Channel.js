"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Context2 = require("./Context");

var _Context3 = _interopRequireDefault(_Context2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = function (_Context) {
    _inherits(Channel, _Context);

    function Channel() {
        _classCallCheck(this, Channel);

        var _this = _possibleConstructorReturn(this, (Channel.__proto__ || Object.getPrototypeOf(Channel)).call(this, {
            subjects: new Map()
        }));

        _this.add.apply(_this, arguments);
        return _this;
    }

    _createClass(Channel, [{
        key: "add",
        value: function add() {
            for (var _len = arguments.length, subjects = Array(_len), _key = 0; _key < _len; _key++) {
                subjects[_key] = arguments[_key];
            }

            return this.watch.apply(this, ["update"].concat(subjects));
        }
    }, {
        key: "remove",
        value: function remove() {
            for (var _len2 = arguments.length, subjects = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                subjects[_key2] = arguments[_key2];
            }

            return this.unwatch.apply(this, ["update"].concat(subjects));
        }
    }, {
        key: "watch",
        value: function watch(type) {
            var _this2 = this;

            for (var _len3 = arguments.length, subjects = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                subjects[_key3 - 1] = arguments[_key3];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var subject = _step.value;

                    var fn = function fn() {
                        var _broadcast;

                        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                            args[_key4] = arguments[_key4];
                        }

                        return (_broadcast = _this2.broadcast).call.apply(_broadcast, [_this2, subject, type].concat(args));
                    };

                    subject.on(type, fn);

                    _this2._state.subjects.set(subject, [subject, fn]);
                };

                for (var _iterator = subjects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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
        key: "unwatch",
        value: function unwatch(type) {
            for (var _len5 = arguments.length, subjects = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                subjects[_key5 - 1] = arguments[_key5];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = subjects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _subject = _step2.value;

                    _subject.off(type, this._state.subjects.get(_subject).pop());

                    this._state.subjects.delete(_subject);
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

            return this;
        }
    }, {
        key: "subscribe",
        value: function subscribe() {
            for (var _len6 = arguments.length, subscribers = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                subscribers[_key6] = arguments[_key6];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = subscribers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var subscriber = _step3.value;

                    if (typeof subscriber === "function") {
                        this.on("broadcast", subscriber);
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

            return this._subscribers;
        }
    }, {
        key: "unsubscribe",
        value: function unsubscribe() {
            for (var _len7 = arguments.length, subscribers = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                subscribers[_key7] = arguments[_key7];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = subscribers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var subscriber = _step4.value;

                    if (typeof subscriber === "function") {
                        this.off("broadcast", subscriber);
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

            return this._subscribers;
        }
    }, {
        key: "broadcast",
        value: function broadcast() {
            for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                args[_key8] = arguments[_key8];
            }

            this.emit.apply(this, ["broadcast"].concat(args));
        }
    }]);

    return Channel;
}(_Context3.default);

exports.default = Channel;
;