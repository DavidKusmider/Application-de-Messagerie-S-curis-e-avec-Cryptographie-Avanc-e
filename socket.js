const { Server } = require('socket.io');
const { publicEncrypt } = require('crypto');

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

    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    socket.on('message', (message/* encryptedMessage */) => {
      console.log('Received message:', message);
      // console.log('Received encrypted message:', encryptedMessage);

      // const decryptedContent = privateDecrypt(
      //   {
      //     key: privateKey,
      //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      //     oaepHash: 'sha256',
      //   },
      //   Buffer.from(encryptedMessage.message, 'base64')
      // );

      // const decryptedMessage = {
      //   ...encryptedMessage,
      //   message: decryptedContent.toString(),
      // };

      // console.log('Decrypted message:', decryptedMessage);
      broadcastMessage(message);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  });
};

const broadcastMessage = (message) => {
  if (io) {
    io.to(message.conversationId).emit('message', message);
  }
};

module.exports = { initWebSocket, broadcastMessage };
