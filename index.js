const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let gameState = {
    phase: "SELECTION", // "SELECTION" ወይም "PLAYING"
    timer: 50,
    calledNumbers: [],
    players: {}, // { socketId: { selected: [], wallet: 100, isPaid: true } }
    derash: 0
};

// የ50 ሰከንድ ዑደት
function startGlobalTimer() {
    let interval = setInterval(() => {
        if (gameState.timer > 0) {
            gameState.timer--;
        } else {
            if (gameState.phase === "SELECTION") {
                gameState.phase = "PLAYING";
                gameState.timer = 0; // መቆጠሩን ያቆማል
                startCallingNumbers();
            }
        }
        io.emit('stateUpdate', gameState);
    }, 1000);
}

function startCallingNumbers() {
    let callInterval = setInterval(() => {
        if (gameState.calledNumbers.length < 75) {
            let next;
            do { next = Math.floor(Math.random() * 75) + 1; } 
            while (gameState.calledNumbers.includes(next));
            
            gameState.calledNumbers.push(next);
            io.emit('nextNumber', { number: next, list: gameState.calledNumbers });
        } else {
            clearInterval(callInterval);
        }
    }, 4000); // በየ 4 ሰከንዱ
}

io.on('connection', (socket) => {
    gameState.players[socket.id] = { selected: [], wallet: 1000, isPaid: true };
    socket.emit('stateUpdate', gameState);

    // ተጫዋቹ ቁጥር ሲመርጥ ለሁሉም LIVE እንዲታይ
    socket.on('selectNumber', (num) => {
        if (gameState.phase === "SELECTION") {
            let p = gameState.players[socket.id];
            if (p.selected.includes(num)) {
                p.selected = p.selected.filter(n => n !== num);
            } else if (p.selected.length < 15) {
                p.selected.push(num);
            }
            io.emit('playerAction', { id: socket.id, selected: p.selected });
        }
    });
});

startGlobalTimer();
server.listen(3000, () => console.log("Bingo Server Running..."));
