"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Observer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;
exports.SubjectFactory = SubjectFactory;

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _uuid = require("uuid");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * <Observer> will bubble up the original <Observable> and
 *      the first <Observer> to observe the change, no matter
 *      how many nested-levels deep the observation took place.
 */
var Observer = exports.Observer = function (_EventEmitter) {
    _inherits(Observer, _EventEmitter);

    function Observer(observable) {
        _classCallCheck(this, Observer);

        var _this = _possibleConstructorReturn(this, (Observer.__proto__ || Object.getPrototypeOf(Observer)).call(this));

        _this.__id = (0, _uuid.v4)();
        _this.subject = observable;
        return _this;
    }

    _createClass(Observer, [{
        key: "subject",
        get: function get() {
            if (this.__subject instanceof Observer) {
                return this.__subject.subject;
            }

            return this.__subject;
        },
        set: function set(observable) {
            var _this2 = this;

            if (observable instanceof _Observable2.default || _util2.default.types.isProxy(observable)) {
                this.__subject = observable;
                this.__subject.next = function (props, value) {
                    _this2.emit(props, value, observable, _this2);
                    _this2.emit("next", props, value, observable, _this2);
                };
            } else if (observable instanceof Observer || observable instanceof Beacon) {
                this.__subject = observable;
                this.__subject.on("next", function (props, value, subject, observer) {
                    _this2.emit("next", props, value, subject, observer);
                });
            }

            return this;
        }
    }]);

    return Observer;
}(_events2.default);

;

//  Create an <Observer> from an EXISTING <Observable>
function Factory(observable) {
    return new Observer(observable);
};

//  Create an <Observer> from an NON-EXISTING <Observable> via Observable.Factory(...args)
function SubjectFactory() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isDeep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return new Observer(_Observable2.default.Factory(state, isDeep));
};

Observer.Factory = Factory;
Observer.SubjectFactory = SubjectFactory;

exports.default = Observer;