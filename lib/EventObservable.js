"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StandardLibrary = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Observable2 = require("./Observable");

var _Observable3 = _interopRequireDefault(_Observable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable */


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

var EventObservable = function (_Observable) {
    _inherits(EventObservable, _Observable);

    function EventObservable(eventEmitter) {
        var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$windowDefault = _ref.windowDefault,
            windowDefault = _ref$windowDefault === undefined ? true : _ref$windowDefault;

        _classCallCheck(this, EventObservable);

        var _this = _possibleConstructorReturn(this, (EventObservable.__proto__ || Object.getPrototypeOf(EventObservable)).call(this, false));

        if (windowDefault) {
            eventEmitter = eventEmitter || window;
        }

        _this.subject = eventEmitter;

        _this.add.apply(_this, _toConsumableArray(events));
        return _this;
    }

    _createClass(EventObservable, [{
        key: "__updateFn",
        value: function __updateFn(e) {
            this[e.type] = {
                e: e,
                dt: Date.now(),
                n: ((this[e.type] || {}).n || 0) + 1
            };
        }
    }, {
        key: "add",
        value: function add() {
            for (var _len = arguments.length, eventNames = Array(_len), _key = 0; _key < _len; _key++) {
                eventNames[_key] = arguments[_key];
            }

            if (Array.isArray(eventNames[0])) {
                // "Single argument" assumption, overload
                eventNames = eventNames[0];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = eventNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var eventName = _step.value;

                    this.subject.on(eventName, this.__updateFn.bind(this));
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
    }, {
        key: "remove",
        value: function remove() {
            for (var _len2 = arguments.length, eventNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                eventNames[_key2] = arguments[_key2];
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
                    var eventName = _step2.value;

                    delete this[eventName];

                    this.subject.off(eventName, this.__updateFn.bind(this));
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
    }]);

    return EventObservable;
}(_Observable3.default);

exports.default = EventObservable;