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
    const ranks = '23456789TJQKA'.split('')
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

  stand() {
    this.player = null;
    this.balance = 0;
    this.undeal();
  }

  sit(player, buyin, cb) {
    this.player = player;
    this.balance = buyin;
    cb();
  }

  deal(card) {
    this.card = card;
  }

  award(amount) {
    this.balance += amount;
  }

  undeal() {
    this.card = null;
  }
}

class ScrewYourNeighborTable {
  constructor(seatCount) {
    this.deck = new Deck();
    this.seats = new Array(seatCount).fill(0).map(a => new ScrewYourNeighborSeat());
    this.players = {};
  }

  get playerCount() {
    return this.seats.length;
  }

  stand(player) {
    this.seats[this.players[player]].stand();
    delete this.players[player];
  }

  sit(seatNumber, player, buyin) {
    // TODO: check for seating conflict
    this.seat[seatNumber].sit(player, buyin, () => {
      this.players[player] = seatNumber;
    });
  }

  getLeftNonEmptySeat(fromSeatNumber) {
    const leftSeatNumber = (fromSeatNumber + 1) % this.playerCount;
    const leftSeat = this.seats[leftSeatNumber];
    return leftSeat.isEmpty() ? getLeftNonEmptySeat(leftSeatNumber) : leftSeat;
  }

  nextDealer() {
    if (this.dealer === undefined) {
      this.dealer = Math.floor(Math.random() * this.playerCount);
    } else {
      this.dealer = (this.dealer + 1) % this.playerCount;
    }

    if (this.seats[this.dealer].isEmpty()) {
      this.nextDealer();
    }
  }

  nextTurn(fromSeatNumber = this.turn) {
    this.turn = (fromSeatNumber + 1) % this.playerCount;
    if (this.seats[this.turn].isEmpty()) {
      this.nextTurn();
    }
  }

  deal() {
    this.deck.shuffle();
    this.seats.forEach(seat => {
      if (!seat.isEmpty()) {
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
      const leftSeat = this.getLeftNonEmptySeat(this.turn);
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
    // TODO: evaluate losing hands
    // TODO: decrement balances and start another round
  }
}