"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Card = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase2 = require("./../../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

var _CardCollection = require("./CardCollection");

var _CardCollection2 = _interopRequireDefault(_CardCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Card = exports.Card = function (_AgencyBase) {
	_inherits(Card, _AgencyBase);

	function Card() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    deck = _ref.deck,
		    _ref$state = _ref.state,
		    state = _ref$state === undefined ? {} : _ref$state;

		_classCallCheck(this, Card);

		var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this));

		_this._deck = deck;
		_this.state = state;
		return _this;
	}

	_createClass(Card, [{
		key: "discard",
		value: function discard() {
			if (this._deck) {
				this._deck.discard(this);
			}

			return this;
		}
	}], [{
		key: "FromSchema",
		value: function FromSchema(seedFn) {
			var qty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

			var cards = [];

			for (var i = 0; i < qty; i++) {
				cards.push(new Card({
					state: seedFn(i)
				}));
			}

			if (qty > 1) {
				return new _CardCollection2.default({ cards: cards });
			}

			return cards[0];
		}
	}]);

	return Card;
}(_AgencyBase3.default);

;

exports.default = Card;