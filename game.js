class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  get rankValue {
    return '23456789TJQKA'.indexOf(this.rank);
  }
}

class Deck {
  constructor() {
    const ranks = '23456789TJQKA'.split('');
    const suits = 'cdhs'.split('');
    this.cards = [];
    for (let r of ranks) {
      for (let s of suits) {
        this.cards.push(new Card(r, s));
      }
    }
    this.shuffle();
  }

  shuffle() {
    this.cards.sort((a, b) => 0.5 - Math.random());  // TODO: Fisher-Yates
    this.i = 0;
  }

  next() {
    return this.cards[i++];
  }
}

class ScrewYourNeighborSeat {
  constructor() {
    this.stand();
  }

  isEmpty() {
    return this.player === null;
  }

  isLive() {
    return !this.isEmpty() && this.stack > 0;
  }

  stand() {
    this.player = null;
    this.stack = 0;
    this.undeal();
  }

  sit(player, buyin, cb) {
    this.player = player;
    this.stack = buyin;
    cb();
  }

  deal(card) {
    this.card = card;
  }

  award(amount) {
    this.stack += amount;
  }

  undeal() {
    this.card = null;
  }
}

class ScrewYourNeighborTable {
  constructor(seatCount, startingStack = 3) {
    this.deck = new Deck();
    this.seats = new Array(seatCount).fill(0).map(a => new ScrewYourNeighborSeat());
    this.players = {};
    this.startingStack = startingStack;
  }

  get liveSeats() {
    return this.seats.filter(seat => seat.isLive());
  }

  stand(player) {
    this.seats[this.players[player]].stand();
    delete this.players[player];
  }

  sit(seatNumber, player, buyin = this.startingStack) {
    // TODO: check for seating conflict
    this.seat[seatNumber].sit(player, buyin, () => {
      this.players[player] = seatNumber;
    });
  }

  startTourney() {
    this.pot = 0;
    this.startHand();
  }

  getNextLiveSeat(fromSeatNumber = this.turn) {
    const nextSeatNumber = (fromSeatNumber + 1) % this.seats.length;
    const nextSeat = this.seats[nextSeatNumber];
    return nextSeat.isLive() ? nextSeat : getNextLiveSeat(nextSeatNumber);
  }

  nextDealer() {
    if (this.dealer === undefined) {
      this.dealer = Math.floor(Math.random() * this.seats.length);
    } else {
      this.dealer = (this.dealer + 1) % this.seats.length;
    }

    if (!this.seats[this.dealer].isLive()) {
      this.nextDealer();
    }
  }

  nextTurn(fromSeatNumber = this.turn) {
    this.turn = (fromSeatNumber + 1) % this.seats.length;
    if (!this.seats[this.turn].isLive()) {
      this.nextTurn();
    }
  }

  deal() {
    this.deck.shuffle();
    this.seats.forEach(seat => {
      if (seat.isLive()) {
        seat.deal(deck.next());
      }
    });
  }

  startHand() {
    this.deal();
    this.nextDealer();
    this.nextTurn(this.dealer);
  }

  actionSwap(player) {
    if (this.players[player] !== this.turn) return;
    const seat = this.seats[this.turn];
    if (this.turn === this.dealer) {
      seat.deal(deck.next());
      this.endHand();
    } else {
      const leftSeat = this.getNextLiveSeat();
      if (leftSeat.card.rank !== 'K') {
        [seat.card, leftSeat.card] = [leftSeat.card, seat.card];
      }
      this.nextTurn();
    }
  }

  actionStay(player) {
    if (this.players[player] !== this.turn) return;
    if (this.turn === this.dealer) {
      this.endHand();
    } else {
      this.nextTurn();
    }
  }

  endHand() {
    const liveSeats = this.liveSeats;
    const low = Math.min(...liveSeats.map(seat => seat.card.rankValue));
    const losers = liveSeats.filter(seat => seat.card.rankValue === low);
    losers.forEach(seat => {
      seat.award(-1);
    });

    this.pot += losers.length;
    // TODO: notify win via callback

    if (this.liveSeats.length) {
      setTimeout(this.startHand.bind(this), 0);
    } else {  // tie game
      this.seats.forEach(seat => {
        if (!seat.isEmpty()) {
          seat.award(this.startingStack);
        }
      });
      setTimeout(this.startTourney.bind(this), 0);
    }
  }
}