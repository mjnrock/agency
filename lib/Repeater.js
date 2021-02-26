"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable */


var _mainloop = require("mainloop.js");

var _mainloop2 = _interopRequireDefault(_mainloop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameLoop = function () {
    function GameLoop() {
        var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
        var onTick = arguments[1];

        _classCallCheck(this, GameLoop);

        this._fps = fps;

        if (typeof onTick === "function") {
            this.onTick = onTick;
        }

        this.loop = _mainloop2.default.setBegin(this.pre.bind(this)).setUpdate(this.update.bind(this)).setDraw(this.draw.bind(this)).setEnd(this.post.bind(this)).setSimulationTimestep(this.spf);
    }

    _createClass(GameLoop, [{
        key: "start",
        value: function start() {
            this.loop.start();

            return this;
        }
    }, {
        key: "stop",
        value: function stop() {

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
            this.onTick(dt, Date.now());
        }
    }, {
        key: "onTick",
        value: function onTick() {}

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
        key: "fps",
        get: function get() {
            return this._fps;
        },
        set: function set(fps) {
            this._fps = fps;

            if (this.isRunning === true) {
                this.stop();
                this.start();
            }
        }
    }, {
        key: "spf",
        get: function get() {
            return 1000 / this.fps;
        }
    }]);

    return GameLoop;
}();

exports.default = GameLoop;