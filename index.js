const { Telegraf } = require('telegraf');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const path = require('path');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const server = http.createServer(app);

const db = new sqlite3.Database('./bingo.db');
db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, balance REAL DEFAULT 100.0)`);

app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
    const appUrl = process.env.APP_URL;
    ctx.reply(`እንኳን ወደ Arif Bingo በደህና መጡ! 🎰`, {
        reply_markup: {
            inline_keyboard: [[{ text: "Play Bingo 🎮", web_app: { url: `${appUrl}/index.html` } }]]
        }
    });
});

const PORT = process.env.PORT || 3000;
bot.launch();
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
