export class OrientationSensor {
	constructor() {

	}

	static async Invoke() {
		const sensor = new AbsoluteOrientationSensor();

		return Promise.all([
			navigator.permissions.query({ name: "accelerometer" }),
			navigator.permissions.query({ name: "magnetometer" }),
			navigator.permissions.query({ name: "gyroscope" }),
		]).then(results => {
			if (results.every(result => result.state === "granted")) {
				const options = { frequency: 60, referenceFrame: 'device' };
				const sensor = new AbsoluteOrientationSensor(options);

				sensor.addEventListener('reading', () => {
					console.log(sensor);
				});
				sensor.addEventListener('error', error => {
					console.log(error)
				});

				sensor.start();
			} else {
				console.log("No permissions to use AbsoluteOrientationSensor.");
			}
		});
	}
};

export default OrientationSensor;