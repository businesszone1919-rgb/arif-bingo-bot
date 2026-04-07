const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});
const path = require('path');

// 'public' ፎልደር ውስጥ ያሉትን ፋይሎች (html, css, js) እንዲያነብ ያደርጋል
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('አዲስ ተጫዋች ገብቷል');
  
  socket.on('numberClicked', (data) => {
    io.emit('updateBoard', data);
  });

  socket.on('disconnect', () => {
    console.log('ተጫዋች ወጥቷል');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው`);
});
