"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Console = exports.Console = function () {
	function Console() {
		_classCallCheck(this, Console);
	}

	_createClass(Console, null, [{
		key: "NewContext",
		value: function NewContext() {
			console.clear();
			console.warn("*************************************************");
			console.warn("************* NEW EXECUTION CONTEXT *************");
			console.warn("*************************************************");

			Console.br(1);

			return this;
		}
	}, {
		key: "clear",
		value: function clear() {
			var _console;

			(_console = console).clear.apply(_console, arguments);
		}
	}, {
		key: "log",
		value: function log() {
			var _console2;

			(_console2 = console).log.apply(_console2, arguments);
		}
	}, {
		key: "info",
		value: function info() {
			var _console3;

			(_console3 = console).info.apply(_console3, arguments);
		}
	}, {
		key: "warn",
		value: function warn() {
			var _console4;

			(_console4 = console).warn.apply(_console4, arguments);
		}
	}, {
		key: "error",
		value: function error() {
			var _console5;

			(_console5 = console).error.apply(_console5, arguments);
		}
	}, {
		key: "br",
		value: function br() {
			var times = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			for (var i = 0; i < times; i++) {
				console.log("");
			}

			return this;
		}
	}, {
		key: "line",
		value: function line(count, symbol) {
			console.log(Array.apply(null, Array(count)).map(function () {
				return symbol;
			}).join(""));

			return this;
		}
	}, {
		key: "hr",
		value: function hr() {
			var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
			var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "-";

			this.line(count, symbol);

			return this;
		}
	}, {
		key: "section",
		value: function section(text) {
			Console.br(1);
			console.log("=================================");
			console.log("==========| " + text + " |==========");
			console.log("=================================");
			Console.br(1);

			return this;
		}
	}, {
		key: "sub",
		value: function sub(text) {
			Console.br(1);
			console.log("---------------------------------");
			console.log("----------| " + text + " |----------");
			console.log("---------------------------------");
			Console.br(1);

			return this;
		}
	}, {
		key: "h1",
		value: function h1(text) {
			Console.br(1);
			console.log("==========| " + text + " |==========");
			Console.br(1);

			return this;
		}
	}, {
		key: "h2",
		value: function h2(text) {
			Console.br(1);
			console.log("----------| " + text + " |----------");
			Console.br(1);

			return this;
		}
	}, {
		key: "open",
		value: function open(text) {
			var l1 = "****************** < " + text + " > ******************";

			Console.br(1);
			this.line(l1.length, "*");
			Console.log(l1);
			Console.br(1);
		}
	}, {
		key: "close",
		value: function close(text) {
			var l1 = "****************** </ " + text + " > ******************";

			Console.br(1);
			Console.log(l1);
			this.line(l1.length, "*");
			Console.br(1);
		}
	}]);

	return Console;
}();

exports.default = Console;