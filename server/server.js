const http = require('http');
const cors = require('cors');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('join', (username) => {
        console.log('New user:', username);
        socket.emit('message', "join successfully");
    });

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });

    socket.on('send-signal', (payload) => {
        io.to(payload.userToSignal).emit('user-joined', {
            signal: payload.signal,
            callerID: payload.callerID,
        });
    });

    socket.on('return-signal', (payload) => {
        io.to(payload.callerID).emit('receiving-returned-signal', {
            signal: payload.signal,
            id: socket.id,
        });
    });

    socket.on('left-room', (roomId, userId) => {
        socket.to(roomId).emit('user-disconnected', userId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
