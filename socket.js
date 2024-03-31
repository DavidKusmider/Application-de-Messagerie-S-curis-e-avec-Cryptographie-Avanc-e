//const http = require('http');
const socket = require("socket.io");
const https = require("https");
const next = require('next');
const fs = require("node:fs");
const crypto = require("node:crypto");

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const handle = app.getRequestHandler();


const PORT = process.env.PORT || 3000;

const privateKeyPath = "./certificates/private-key.pem";
const certificatePath = "./certificates/certificate.pem";

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.prepare().then(() => {
  const server = https.createServer(credentials, (req, res) => {
    handle(req, res);
  });

  const io = new socket.Server(server, {
    cors: {
      origin: ["https://localhost:3000"], // Client URL
    }
  });

  io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

  io.on('connection', async (socket) => {
    console.log(socket.id + ' connected');
    console.log(io.engine.clientsCount);
    socket.on('joinRoom', (room) => {
      console.log("Joining room:", room);
      socket.rooms.forEach((value, value2, set) => {
          if(!socket.rooms.has(room)){
            socket.leave(value);
            socket.join(room);
            console.log("Rooms: ");
            console.log(socket.rooms);
          }
      });
    });

    socket.on('send_message', (message, userData, conversationId, socketId, idUserEncryptedMessage, cb) => {
      const user = userData;
      const mapTemp= new Map(idUserEncryptedMessage);
      console.log(mapTemp);
      console.log("send_message event");
      let formattedContent = JSON.stringify(Array.from(mapTemp.entries()));
      // register message in db
      console.log("New message received:", message);
      const formattedMessage = { id: message.id, content: formattedContent, id_user: user.id, id_group: Number(conversationId), created_at: message.timestamp, send_at: message.timestamp };
      console.log("Sending receive_message event");
      console.log(mapTemp);
      //socket.emit("receive_message", Array.from(mapTemp));
      socket.to(conversationId).emit("receive_message", Array.from(mapTemp));
      console.log("receive_message event finished");
      cb(formattedMessage);
    });

    socket.on('save_group', (newUserGroup, newGroups) => {
      console.log('save_group received.\nupdate_group sent.');
      socket.emit("update_group", newUserGroup, newGroups);
    });
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

  });


  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});




//module.exports = { broadcastMessage };
