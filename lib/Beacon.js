"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Beacon = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.PropType = PropType;
exports.PropTypes = PropTypes;
exports.IsObserver = IsObserver;

var _uuid = require("uuid");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _Observer = require("./Observer");

var _Observer2 = _interopRequireDefault(_Observer);

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A "multi-subject" <Observer>
 */
var Beacon = exports.Beacon = function (_EventEmitter) {
    _inherits(Beacon, _EventEmitter);

    function Beacon() {
        _classCallCheck(this, Beacon);

        var _this = _possibleConstructorReturn(this, (Beacon.__proto__ || Object.getPrototypeOf(Beacon)).call(this));

        _this.members = new Map();
        _this.lookup = new Map();
        return _this;
    }

    _createClass(Beacon, [{
        key: "attach",
        value: function attach(observer, proposition) {
            var _this2 = this;

            if (observer instanceof _Observable2.default) {
                observer = new _Observer2.default(observer);
            }

            var fn = void 0;
            if (proposition instanceof _Proposition2.default) {
                fn = function fn(props, value, ob, obs) {
                    if (proposition.test(props, value, observer)) {
                        _this2.emit(props, value, ob || observer.subject, obs || observer);
                        _this2.emit("next", props, value, ob || observer.subject, obs || observer);
                    }
                };
            } else {
                fn = function fn(props, value, ob, obs) {
                    _this2.emit(props, value, ob || observer.subject, obs || observer);
                    _this2.emit("next", props, value, ob || observer.subject, obs || observer);
                };
            };

            this.members.set(observer.__id, { member: observer, fn: fn });

            observer.on("next", fn);

            return observer;
        }
    }, {
        key: "detach",
        value: function detach(observer) {
            var _members$get = this.members.get(observer.__id),
                fn = _members$get.fn;

            observer.off("next", fn);

            this.members.delete(observer.__id);
        }
    }, {
        key: "addAltListener",
        value: function addAltListener() {
            var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "prop";
            var input = arguments[1];
            var fn = arguments[2];

            var uuid = (0, _uuid.v4)();

            var wfn = void 0;
            if (type === "prop") {
                wfn = function wfn(p, v, ob, obs) {
                    if (p === input) {
                        fn(p, v, ob, obs);
                    }
                };
            } else if (type === "observable") {
                wfn = function wfn(p, v, ob, obs) {
                    if (ob === input || ob.__id === input) {
                        fn(p, v, ob, obs);
                    }
                };
            } else if (type === "observer") {
                wfn = function wfn(p, v, ob, obs) {
                    if (obs === input || obs.__id === input) {
                        fn(p, v, ob, obs);
                    }
                };
            }

            this.lookup.set(uuid, wfn);
            this.on("next", wfn);

            return uuid;
        }
    }, {
        key: "addPropListener",
        value: function addPropListener(property, fn) {
            return this.addAltListener("prop", property, fn);
        }
    }, {
        key: "addObservableListener",
        value: function addObservableListener(observable, fn) {
            return this.addAltListener("observable", observable, fn);
        }
    }, {
        key: "addObserverListener",
        value: function addObserverListener(observer, fn) {
            return this.addAltListener("observer", observer, fn);
        }
    }]);

    return Beacon;
}(_events2.default);

function PropType(prop) {
    if (prop instanceof RegExp) {
        return _Proposition2.default.OR(function (props, value, observer) {
            return prop.test(props);
        });
    }

    return _Proposition2.default.OR(function (props, value, observer) {
        return props === prop;
    });
}
function PropTypes() {
    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
    }

    return _Proposition2.default.OR(function (prop, value, observer) {
        return props.includes(prop);
    });
}

function IsObserver(observerOrId) {
    return _Proposition2.default.OR(function (prop, value, observer) {
        if (observerOrId instanceof _Observer2.default) {
            return observer === observerOrId;
        }

        return observer.__id === observerOrId;
    });
}

Beacon.PropType = PropType;
Beacon.PropTypes = PropTypes;
Beacon.IsObserver = IsObserver;

exports.default = Beacon;