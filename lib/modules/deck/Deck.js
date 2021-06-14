"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Deck = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _$Dispatchable = require("./../../event/$Dispatchable");

var _$Dispatchable2 = _interopRequireDefault(_$Dispatchable);

var _helper = require("../../util/helper");

var _Card = require("./Card");

var _Card2 = _interopRequireDefault(_Card);

var _CardCollection = require("./CardCollection");

var _CardCollection2 = _interopRequireDefault(_CardCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ### README
 * 
 * The <Deck> is a <Card> aggregator that maintains a
 * 	provenance-awareness of every <Card> that it contains.
 * 	As play progresses, <Card(s)> are transferred to piles
 * 	within the deck, and the master registry (the <Deck> class
 * 	itself), keep reference to which <Card(s)> are where.
 * 
 * As the <Deck> expects game play, it also expects a player count.
 * 	Each player is given a "hand-#", which internally is a pile.
 * 	While the <Deck> contains piles for the players, the data should
 * 	primarily be read externally, and manipulated internally.
 * 
 * The <Deck> should be used as a light-weight source-of-truth,
 * 	and the actual game should simply reference and abstract data
 * 	from the <Deck> class.
 */
var Deck = exports.Deck = function (_compose) {
	_inherits(Deck, _compose);

	function Deck() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$cards = _ref.cards,
		    cards = _ref$cards === undefined ? [] : _ref$cards,
		    _ref$piles = _ref.piles,
		    piles = _ref$piles === undefined ? [] : _ref$piles,
		    _ref$hooks = _ref.hooks,
		    hooks = _ref$hooks === undefined ? {} : _ref$hooks;

		_classCallCheck(this, Deck);

		var _this = _possibleConstructorReturn(this, (Deck.__proto__ || Object.getPrototypeOf(Deck)).call(this, {
			Dispatchable: {
				hooks: hooks
			}
		}));

		_this.setCards(cards); // "Card Dictionary"

		_this.piles = new Map([["draw", new _CardCollection2.default(_this.getCards())], ["discard", new _CardCollection2.default()]]);

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = piles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var pile = _step.value;

				_this.piles.set(pile, new _CardCollection2.default());
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return _this;
	}

	//FIXME	Figure out paradigm for ordering

	_createClass(Deck, [{
		key: "_interpretCards",
		value: function _interpretCards(cards) {
			if (typeof cards === "number") {
				return cards;
			} else if (cards instanceof _Card2.default) {
				return cards;
			} else if (cards instanceof _CardCollection2.default) {
				return cards.getCards();
			} else if (Array.isArray(cards)) {
				var cardList = [];
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var card = _step2.value;

						cardList.push(this._interpretCards(card));
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				return cardList;
			} else if (typeof cards === "function") {
				return this._interpretCards(cards(this));
			}

			return [];
		}
		/**
   * @param {Card[]|CardCollection|int|fn} cards | The `fn` must return one of the @card types, *except* another function (i.e. single-tier evaluation)
   */

	}, {
		key: "move",
		value: function move() {
			var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var from = arguments[1];
			var to = arguments[2];

			var fromPile = this.piles.get(from);
			var toPile = this.piles.get(to);

			var cardList = this._interpretCards(cards);

			if (typeof cardList === "number") {
				cardList = [].concat(_toConsumableArray(fromPile)).slice(0, cardList);
			}

			if (fromPile instanceof _CardCollection2.default && toPile instanceof _CardCollection2.default) {
				fromPile.transfer(cardList, toPile, true);

				this.dispatch(Deck.Signal.TX, { from: from, to: to, cards: cards });

				return true;
			}

			return false;
		}
	}, {
		key: "draw",
		value: function draw() {
			var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var to = arguments[1];

			return this.move(cards, "draw", to);
		}
	}, {
		key: "discard",
		value: function discard() {
			var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var from = arguments[1];

			return this.move(cards, from, "discard");
		}
	}, {
		key: "fromCollection",
		value: function fromCollection(collection) {
			var reassignIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.empty();
			this.copyFrom(collection, reassignIds);

			return this;
		}
	}], [{
		key: "FromCollection",
		value: function FromCollection(collection) {
			var reassignIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var deck = new Deck();

			return deck.fromCollection(collection, reassignIds);
		}
	}]);

	return Deck;
}((0, _helper.compose)(_$Dispatchable2.default)(_CardCollection2.default));

Deck.Signal = {
	TX: "Deck.Transaction"
};
;

exports.default = Deck;