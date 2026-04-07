const TelegramBot = require("node-telegram-bot-api");
const { game, addPlayer, pay, pickCard, tick, startGame, callNumber } = require("./game");

const TOKEN = "PASTE_YOUR_TOKEN";
const bot = new TelegramBot(TOKEN, { polling: true });

// Start
bot.onText(/\/start/, (msg) => {
  let id = msg.chat.id;
  addPlayer(id);

  bot.sendMessage(id, "🎱 Welcome to Bingo!", {
    reply_markup: {
      keyboard: [
        ["💰 Pay & Play"],
        ["🎟️ Pick Card"],
        ["📊 Status"]
      ],
      resize_keyboard: true
    }
  });
});

// Pay
bot.onText(/Pay/, (msg) => {
  let id = msg.chat.id;
  pay(id);
  bot.sendMessage(id, "✅ You joined the game!");
});

// Pick card
bot.onText(/Pick/, (msg) => {
  let id = msg.chat.id;

  let buttons = [];
  for (let i = 1; i <= 25; i++) {
    buttons.push([{ text: i.toString(), callback_data: i.toString() }]);
  }

  bot.sendMessage(id, "Select numbers:", {
    reply_markup: {
      inline_keyboard: buttons
    }
  });
});

// Handle click
bot.on("callback_query", (query) => {
  let id = query.message.chat.id;
  let num = parseInt(query.data);

  pickCard(id, num);

  bot.answerCallbackQuery(query.id, { text: "Selected " + num });
});

// Status
bot.onText(/Status/, (msg) => {
  let id = msg.chat.id;
  bot.sendMessage(id, `⏱ Time: ${game.timeLeft}\n🎯 Called: ${game.called.length}`);
});

// Timer
setInterval(() => {
  tick();

  if (game.timeLeft === 0 && !game.started) {
    startGame();
    broadcast("🎮 Game Started!");
  }
}, 1000);

// Number calling
setInterval(() => {
  if (game.started) {
    let num = callNumber();
    if (num) {
      broadcast("📢 Number: " + num);
    }
  }
}, 3000);

// Broadcast
function broadcast(text) {
  Object.keys(game.players).forEach(id => {
    bot.sendMessage(id, text);
  });
}
