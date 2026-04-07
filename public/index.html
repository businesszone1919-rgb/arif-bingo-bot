const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// የፋይሎች ማውጫ (Folder) ትክክል መሆኑን ማረጋገጥ
app.use(express.static(path.join(__dirname, 'public')));

let calledNumbers = [];
let playersCount = 0;

// የቢንጎ ቁጥሮችን በየ 5 ሰከንዱ እንዲያወጣ ማድረግ
function startBingo() {
    setInterval(() => {
        if (calledNumbers.length < 75) {
            let nextNum;
            do {
                nextNum = Math.floor(Math.random() * 75) + 1;
            } while (calledNumbers.includes(nextNum));
            
            calledNumbers.push(nextNum);
            io.emit('nextNumber', { 
                number: nextNum, 
                calledNumbers: calledNumbers 
            });
        } else {
            calledNumbers = []; // ጨዋታውን እንደገና ለመጀመር
        }
    }, 5000); 
}

io.on('connection', (socket) => {
    playersCount++;
    console.log('አዲስ ተጫዋች ገብቷል!');
    
    // ለገቡት ተጫዋቾች ያሉትን መረጃዎች መላክ
    io.emit('updateStats', { 
        playersCount: playersCount,
        derash: (playersCount * 10) * 0.9 // ኮሚሽን ቀንሶ
    });

    socket.on('disconnect', () => {
        playersCount--;
        io.emit('updateStats', { playersCount: playersCount });
    });
});

startBingo();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
