"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Module = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Module is essentially a meta-wrapper around a Component that allows for a more
 * useful paradigm, holding important references and having the ability to reseed whatever
 * component it controls.
 */
var Module = exports.Module = function () {
	function Module(nomen) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    entity = _ref.entity,
		    componentClass = _ref.componentClass,
		    system = _ref.system,
		    _ref$args = _ref.args,
		    args = _ref$args === undefined ? [] : _ref$args,
		    _ref$tags = _ref.tags,
		    tags = _ref$tags === undefined ? [] : _ref$tags;

		_classCallCheck(this, Module);

		this.id = (0, _uuid.v4)();
		this.nomen = nomen; // The unique name for a Module
		this.tags = new Set(tags); // Any tags for filtering/selection

		this.defaultArgs = args; // Used as defaults when reseeding
		this.classes = {
			component: componentClass // Used to reseed
		};

		this.state = new (Function.prototype.bind.apply(this.classes.component, [null].concat(_toConsumableArray(this.defaultArgs))))(); // State *is* the component
		this.system = system; // Allow system ref to change, but have same nomen

		if (entity) {
			this.register(entity);
		}

		this.state.__module = this; // See NOTE in Component file
	}

	_createClass(Module, [{
		key: "$",
		value: function $(trigger) {
			var _system;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			return (_system = this.system).invoke.apply(_system, [trigger, this].concat(args));
		}
	}, {
		key: "reseed",
		value: function reseed() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			if (args.length === 0) {
				this.state = new (Function.prototype.bind.apply(this.classes.component, [null].concat(_toConsumableArray(this.defaultArgs))))();
			} else {
				this.state = new (Function.prototype.bind.apply(this.classes.component, [null].concat(args)))();
			}

			this.state.__module = this;

			return this;
		}
	}, {
		key: "attach",
		value: function attach(system) {
			this.system = system;

			return this;
		}
	}, {
		key: "detach",
		value: function detach() {
			this.system = null;

			return this;
		}
	}, {
		key: "register",
		value: function register(entity) {
			entity.register(this.nomen, this);
			this.entity = entity;

			return this;
		}
	}, {
		key: "unregister",
		value: function unregister(entity) {
			if (entity === this.entity) {
				entity.unregister(this.nomen);
				this.entity = null;
			}

			return this;
		}
	}], [{
		key: "Register",
		value: function Register(nomen) {
			var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    entity = _ref2.entity,
			    componentClass = _ref2.componentClass,
			    system = _ref2.system,
			    _ref2$args = _ref2.args,
			    args = _ref2$args === undefined ? [] : _ref2$args,
			    _ref2$tags = _ref2.tags,
			    tags = _ref2$tags === undefined ? [] : _ref2$tags;

			var module = new this(nomen, { entity: entity, componentClass: componentClass, system: system, args: args, tags: tags });
			// module.register(entity);

			return module;
		}
	}, {
		key: "Unregister",
		value: function Unregister(entity, nomen) {
			var module = entity[nomen];
			module.unregister(entity);

			return module;
		}
	}]);

	return Module;
}();

;

exports.default = Module;