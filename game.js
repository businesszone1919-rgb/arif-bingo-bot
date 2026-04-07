let game = {
  players: {},
  timeLeft: 50,
  started: false,
  numbers: shuffle([...Array(75).keys()].map(n => n + 1)),
  called: [],
  bet: 10
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

module.exports = {
  game,

  addPlayer(id) {
    if (!game.players[id]) {
      game.players[id] = {
        wallet: 100,
        paid: false,
        card: []
      };
    }
  },

  pay(id) {
    let p = game.players[id];
    if (p.wallet >= game.bet) {
      p.wallet -= game.bet;
      p.paid = true;
    }
  },

  pickCard(id, num) {
    let p = game.players[id];
    if (p.paid) {
      p.card.push(num);
    }
  },

  tick() {
    if (!game.started && game.timeLeft > 0) {
      game.timeLeft--;
    }
  },

  startGame() {
    game.started = true;
  },

  callNumber() {
    if (game.numbers.length === 0) return null;
    let num = game.numbers.pop();
    game.called.push(num);
    return num;
  }
};
