"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventObservable = exports.StandardLibrary = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;
exports.SubjectFactory = SubjectFactory;

var _Observable2 = require("./Observable");

var _Observable3 = _interopRequireDefault(_Observable2);

var _Observer = require("./Observer");

var _Observer2 = _interopRequireDefault(_Observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StandardLibrary = exports.StandardLibrary = {
    Keyboard: ["keyup", "keydown", "keypress"],
    Mouse: ["mouseup", "mousedown", "mousemove", "click", "dblclick", "contextmenu"]
    // Pointer: [
    //     "pointerover",
    //     "pointerenter",
    //     "pointerdown",
    //     "pointermove",
    //     "pointerup",
    //     "pointercancel",
    //     "pointerout",
    //     "pointerleave",
    //     "gotpointercapture",
    //     "lostpointercapture",
    // ],
};

/**
 * This class wraps an <EventEmitter> and watches
 *      for @events.  Each invocation will store
 *      all arguments present in the event into a
 *      local this[ eventName ] object, thus triggering
 *      any attached <Observer> to broadcast the data.
 *      
 * The <EventObservable> will cache the previous (n-1)
 *      data so that comparative analysis can be performed.
 * 
 * ! Because of the getter/setters on <Observable>, you
 * !    cannot follow a "next" event; you must specify
 * !    the specific properties, if wrapping an "nextable".
 */

var EventObservable = exports.EventObservable = function (_Observable) {
    _inherits(EventObservable, _Observable);

    function EventObservable(eventEmitter) {
        var _ret;

        var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, EventObservable);

        var _this2 = _possibleConstructorReturn(this, (EventObservable.__proto__ || Object.getPrototypeOf(EventObservable)).call(this, false, { noWrap: true }));

        _this2.__emitter = eventEmitter;
        _this2.__handlers = {};

        var _this = new Proxy(_this2, {
            get: function get(target, prop) {
                return target[prop];
            },
            set: function set(target, prop, value) {
                target[prop] = value;
                target.next(prop, target[prop]);

                return target;
            }
        });

        _this.add.apply(_this, _toConsumableArray(events));

        return _ret = _this, _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(EventObservable, [{
        key: "__updateFn",
        value: function __updateFn(type) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            this[type] = {
                previous: {
                    data: this[type].data,
                    dt: this[type].dt,
                    n: this[type].n
                },
                data: args,
                dt: Date.now(),
                n: (this[type].n || 0) + 1
            };
        }
    }, {
        key: "add",
        value: function add() {
            var _this3 = this;

            for (var _len2 = arguments.length, eventNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                eventNames[_key2] = arguments[_key2];
            }

            if (Array.isArray(eventNames[0])) {
                // "Single argument" assumption, overload
                eventNames = eventNames[0];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var eventName = _step.value;

                    _this3[eventName] = {};
                    _this3.__handlers[eventName] = function () {
                        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                            args[_key3] = arguments[_key3];
                        }

                        return _this3.__updateFn.apply(_this3, [eventName].concat(args));
                    };

                    _this3.__emitter.on(eventName, _this3.__handlers[eventName]);
                };

                for (var _iterator = eventNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        key: "remove",
        value: function remove() {
            for (var _len4 = arguments.length, eventNames = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                eventNames[_key4] = arguments[_key4];
            }

            if (Array.isArray(eventNames[0])) {
                // "Single argument" assumption, overload
                eventNames = eventNames[0];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = eventNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _eventName = _step2.value;

                    this.__emitter.off(_eventName, this.__handlers[_eventName]);

                    delete this[_eventName];
                    delete this.__handlers[_eventName];
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
    }]);

    return EventObservable;
}(_Observable3.default);

//? Use the .Factory method to create a <Observable> with default state


function Factory(eventEmitter, events) {
    return new EventObservable(eventEmitter, events);
};

function SubjectFactory(eventEmitter, events) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return new _Observer2.default(EventObservable.Factory(eventEmitter, events, opts));
};

EventObservable.Factory = Factory;
EventObservable.SubjectFactory = SubjectFactory;

exports.default = EventObservable;