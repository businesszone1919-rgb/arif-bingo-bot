const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});
const path = require('path');

// ፋይሎቹ ያሉበትን ቦታ ለሰርቨሩ ማሳወቅ
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('ተጫዋች ተገናኝቷል!');
  
  socket.on('numberClicked', (data) => {
    io.emit('updateBoard', data);
  });

  socket.on('disconnect', () => {
    console.log('ተጫዋች ወጥቷል');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`ሰርቨር በፖርት ${PORT} ላይ እየሰራ ነው`);
});
