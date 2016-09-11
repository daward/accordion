var cards = require('cards'),
  _ = require('lodash');

var Accordion = function () {

  // this is the "meat" of the game,
  // deciding how to reduce the deck
  var collapse = function (accordion) {
    // will keep restarting from the
    var currentIndex = 0;
    while (currentIndex <= accordion.length) {
      // copy the arrays so that we can run down different
      // decision trees
      var long = accordion.slice(0),
        short = accordion.slice(0),
        collapsed = false;

      // take the long route and then play out the rest
      if (doMatch(long, currentIndex, currentIndex - 3)) {
        long = collapse(long);
        collapsed = true;
      }

      // take the short route and play out the rest
      if (doMatch(short, currentIndex, currentIndex - 1)) {
        short = collapse(short);
        collapsed = true;
      }

      if (short.length < accordion.length) {
        accordion = short;
      }

      if (long.length < accordion.length) {
        accordion = long;
      }

      currentIndex++;
    }
    return accordion;
  }

  // if there's a match between the two cards, then move the higher index
  // (which is later in the set on top of the other)
  var doMatch = function (accordion, currentIndex, candidateIndex) {
    if (matches(accordion, currentIndex, candidateIndex)) {

      // establish the higher index
      var higher = candidateIndex, lower = currentIndex;
      if (higher < lower) {
        var temp = lower;
        lower = higher;
        higher = temp;
      }

      // drop the higher onto the lower, and remove the higher
      // from the tableau
      accordion[lower] = accordion[higher];
      _.pullAt(accordion, higher);
      return true;
    }
    return false;
  }

  var matches = function (accordion, currentIndex, candidateIndex) {
    var current = accordion[currentIndex],
      candidate = accordion[candidateIndex];

    // we might try to compare outside the tableau, ignore that
    if (current === undefined || candidate === undefined) {
      return false;
    }

    // if either the suit or the number match, we can collapse
    return current.suit === candidate.suit ||
      current.value === candidate.value;
  }

  // there's two ways to play accordion, you
  // can immediately collapse the deck after
  // every drawn card, or you can delay until
  // they are all drawn.  The latter is more
  // puzzle-like.
  this.runGame = function (immediate) {
    // build a new deck
    var deck = new cards.PokerDeck();
    // Shuffle the deck 
    deck.shuffleAll();

    var retVal = [], i;
    // Draw a card 
    for (i = 0; i < 52; i++) {
      retVal.push(deck.draw());
      if (immediate) {
        retVal = collapse(retVal);
      }
    }
    if (!immediate) {
      retVal = collapse(retVal);
    }
    return retVal.length;
  }
}

module.exports = Accordion;