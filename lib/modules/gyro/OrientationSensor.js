"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrientationSensor = exports.OrientationSensor = function () {
	function OrientationSensor() {
		_classCallCheck(this, OrientationSensor);
	}

	_createClass(OrientationSensor, null, [{
		key: "Invoke",
		value: async function Invoke() {
			var sensor = new AbsoluteOrientationSensor();

			return Promise.all([navigator.permissions.query({ name: "accelerometer" }), navigator.permissions.query({ name: "magnetometer" }), navigator.permissions.query({ name: "gyroscope" })]).then(function (results) {
				if (results.every(function (result) {
					return result.state === "granted";
				})) {
					var options = { frequency: 60, referenceFrame: 'device' };
					var _sensor = new AbsoluteOrientationSensor(options);

					_sensor.addEventListener('reading', function () {
						console.log(_sensor);
					});
					_sensor.addEventListener('error', function (error) {
						console.log(error);
					});

					_sensor.start();
				} else {
					console.log("No permissions to use AbsoluteOrientationSensor.");
				}
			});
		}
	}]);

	return OrientationSensor;
}();

;

exports.default = OrientationSensor;