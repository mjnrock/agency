"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var $template = exports.$template = function $template(node) {
	return {
		/**
   * This will execute directly *after* Eventable(node) has been evaluated
   * 	but before any other entries have been be evaluated
   */
		$pre: function $pre(node, overlay) {},

		/**
   * This will after *all* other overlay entries have been processed
   */
		$post: function $post(node, overlay) {},


		state: {},
		nodes: {},
		triggers: {},
		subscriptions: [],
		meta: {},
		config: {},
		actions: {}
	};
};

exports.default = $template;