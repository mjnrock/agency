"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pulse = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.preUpdate = preUpdate;
exports.postUpdate = postUpdate;
exports.Factory = Factory;
exports.Watcher = Watcher;

var _mainloop = require("mainloop.js");

var _mainloop2 = _interopRequireDefault(_mainloop);

var _Emitter2 = require("./Emitter");

var _Emitter3 = _interopRequireDefault(_Emitter2);

var _Watcher = require("./Watcher");

var _Watcher2 = _interopRequireDefault(_Watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function preUpdate(ts, dt) {};
function postUpdate(fps, panic) {
    if (panic) {
        var discardedTime = Math.round(_mainloop2.default.resetFrameDelta());
        console.warn("Main loop panicked, probably because the browser tab was put in the background. Discarding ", discardedTime, "ms");
    }
};

var Pulse = exports.Pulse = function (_Emitter) {
    _inherits(Pulse, _Emitter);

    function Pulse() {
        var bps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref$state = _ref.state,
            state = _ref$state === undefined ? {} : _ref$state,
            _ref$deep = _ref.deep,
            deep = _ref$deep === undefined ? false : _ref$deep,
            _ref$autostart = _ref.autostart,
            autostart = _ref$autostart === undefined ? false : _ref$autostart,
            pre = _ref.pre,
            post = _ref.post,
            opts = _objectWithoutProperties(_ref, ["state", "deep", "autostart", "pre", "post"]);

        _classCallCheck(this, Pulse);

        var _this = _possibleConstructorReturn(this, (Pulse.__proto__ || Object.getPrototypeOf(Pulse)).call(this, Pulse.Events, _extends({ state: state, deep: deep }, opts)));

        _this._bps = bps;

        _this.mainLoop = _mainloop2.default.setBegin(preUpdate.bind(_this)).setUpdate(_this.update.bind(_this)).setDraw(_this.draw.bind(_this)).setEnd(postUpdate.bind(_this)).setSimulationTimestep(_this.spb);

        _this.pre = pre;
        _this.post = post;

        if (autostart) {
            _this.start();
        }
        return _this;
    }

    _createClass(Pulse, [{
        key: "start",
        value: function start() {
            this.mainLoop.start();

            return this;
        }
    }, {
        key: "stop",
        value: function stop() {
            this.mainLoop.stop();

            return this;
        }
    }, {
        key: "update",


        /**
         * @param {number} dt Frame delta in ms
         */
        value: function update(dt) {
            this.$tick(dt / 1000, Date.now());
        }

        /**
         * @param {number} interpolationPercentage A factor between 0.0 and 1.0, used as a scaling weight similar to delta time
         */

    }, {
        key: "draw",
        value: function draw(interpolationPercentage) {
            // console.log("%", interpolationPercentage);   //TODO Figure out how to add these "rendering fractional steps" into implementation
        }
    }, {
        key: "bps",
        get: function get() {
            return this._bps;
        },
        set: function set(fps) {
            this._bps = fps;

            if (this.mainLoop.isRunning()) {
                this.stop();
                this.start();
            }
        }
    }, {
        key: "spb",
        get: function get() {
            return 1000 / this.bps;
        }
    }, {
        key: "pre",
        get: function get() {
            return this._pre;
        },
        set: function set(fn) {
            if (typeof fn === "function") {
                this._pre = fn;

                this.mainLoop.setBegin(this.pre);
            }
        }
    }, {
        key: "post",
        get: function get() {
            return this._post;
        },
        set: function set(fn) {
            if (typeof fn === "function") {
                this._post = fn;

                this.mainLoop.setEnd(this.post);
            }
        }
    }]);

    return Pulse;
}(_Emitter3.default);

Pulse.Events = ["tick"];
;

function Factory(bps) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Pulse(bps, opts);
};

function Watcher(bps) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var pulse = new Pulse(bps, opts);
    var watcher = new _Watcher2.default();

    watcher.$.watch(pulse);

    return watcher;
};

Pulse.Factory = Factory;
Pulse.Watcher = Watcher;

exports.default = Pulse;