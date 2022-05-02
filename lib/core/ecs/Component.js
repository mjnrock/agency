"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * In the current paradigm, a Component basically just has to be a Struct
 * in which values can be primitives or classes, thus allowing delegation
 * of processing scope, when appropriate.  Since this is essentially a
 * Record class, internal variables are prefixed as such: this.__internalVar (cf. __id)
 * 
 * TODO In an ideal implementation, a Component has a 1:1 relationship with a DanfoJS DataFrome and is event-mediated through an Agent
 */
var Component = exports.Component = function () {
	function Component() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    id = _ref.id;

		_classCallCheck(this, Component);

		this.__id = id || (0, _uuid.v4)();
	}

	/**
  * NOTE: This is a convenience abstraction ($ and this.__module) such that when using
  * the Entity Component short-hand, that an invocation can be made from the returned
  * Component object without having to then once again search through the Entity.modules
  * to invoke something.  Since a Component is intended to be (though not required) instantiated
  * through a Module, in normal use cases this.__module will always have a value.
  * 
  * ? Syntax Example:
  * const comp = entity[ name ];
  * comp.$("started", Date.now());
  * console.log(comp.key1);
  * console.log(comp.key2);
  * comp.$("finished", Date.now());
  *  */


	_createClass(Component, [{
		key: "$",
		value: function $(trigger) {
			if (this.__module) {
				var _module;

				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				return (_module = this.__module).$.apply(_module, [trigger].concat(args));
			}

			return this;
		}
	}]);

	return Component;
}();

;

exports.default = Component;