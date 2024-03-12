const { Server } = require('socket.io');

let io;

const initWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // Client URL
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('WebSocket connected');

        socket.on('message', (message) => {
            console.log('Received message:', message);
            broadcastMessage(message);
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });
    });
};

const broadcastMessage = (message) => {
    if (io) {
        io.emit('message', message);
    }
};

module.exports = { initWebSocket };
