"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pulse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;
exports.Generate = Generate;

var _mainloop = require("mainloop.js");

var _mainloop2 = _interopRequireDefault(_mainloop);

var _Observable2 = require("./Observable");

var _Observable3 = _interopRequireDefault(_Observable2);

var _Observer = require("./Observer");

var _Observer2 = _interopRequireDefault(_Observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable */


var Pulse = exports.Pulse = function (_Observable) {
    _inherits(Pulse, _Observable);

    function Pulse() {
        var bps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$autostart = _ref.autostart,
            autostart = _ref$autostart === undefined ? true : _ref$autostart;

        _classCallCheck(this, Pulse);

        var _this = _possibleConstructorReturn(this, (Pulse.__proto__ || Object.getPrototypeOf(Pulse)).call(this, false));

        _this._bps = bps;

        _this.loop = _mainloop2.default.setBegin(_this.pre.bind(_this)).setUpdate(_this.update.bind(_this)).setDraw(_this.draw.bind(_this)).setEnd(_this.post.bind(_this)).setSimulationTimestep(_this.spb);

        if (autostart) {
            _this.start();
        }
        return _this;
    }

    _createClass(Pulse, [{
        key: "start",
        value: function start() {
            this.loop.start();

            return this;
        }
    }, {
        key: "stop",
        value: function stop() {
            this.loop.stop();

            return this;
        }

        /**
         * @param {number} ts Total elapsed time
         * @param {number} dt Frame delta in ms
         */

    }, {
        key: "pre",
        value: function pre(ts, dt) {}

        /**
         * @param {number} dt Frame delta in ms
         */

    }, {
        key: "update",
        value: function update(dt) {
            this.next("tick", [dt, Date.now()]);
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
        key: "post",
        value: function post(fps, panic) {
            if (panic) {
                var discardedTime = Math.round(_mainloop2.default.resetFrameDelta());
                console.warn("Main loop panicked, probably because the browser tab was put in the background. Discarding ", discardedTime, "ms");
            }
        }
    }, {
        key: "bps",
        get: function get() {
            return this._bps;
        },
        set: function set(fps) {
            this._bps = fps;

            if (this.isRunning === true) {
                this.stop();
                this.start();
            }
        }
    }, {
        key: "spb",
        get: function get() {
            return 1000 / this.bps;
        }
    }]);

    return Pulse;
}(_Observable3.default);

//  Create an <Observer> from an EXISTING <Observable>


function Factory(bps) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Pulse(bps, opts);
};

//  Create an <Observer> from an NON-EXISTING <Pulse> via Pulse.Factory(...args)
function Generate(bps) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var next = arguments[2];

    var obs = new _Observer2.default(Pulse.Factory(bps, opts));

    if (typeof next === "function") {
        obs.on("next", next);
    }

    return obs;
};

Pulse.Factory = Factory;
Pulse.Generate = Generate;

exports.default = Pulse;