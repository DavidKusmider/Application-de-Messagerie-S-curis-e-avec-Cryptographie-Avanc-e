//const http = require('http');
const socket = require("socket.io");
const https= require("https");
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

/*const generateUserKeyPair = () => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 530,
      publicExponent: 0x10101,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-192-cbc',
        passphrase: 'Hertz eats chipolata all night long'
      }
    });

    return { publicKey, privateKey };
  } catch (error) {
    console.error("Error generating key pair:", error.message);
    throw error;
  }
};*/

app.prepare().then(() => {
  const server = https.createServer(credentials, (req, res) => {
    // Vos logiques de routage pour Next.js peuvent être ajoutées ici si nécessaire
    handle(req, res);
  });

  /*
    l'utilisateur dui envoie un message, envoie son message en BDD et l'ajoute à sa liste de message en statique (déjà) => ne plus utilisé le broadcast lors d'envoie de message
    Utiliser le broadcast pour envoyer le message statique, déjà ecrit en BDD, aux autres utilisateurs sans d'appel BDD supplementaire
    TLD;DR : séparer envoie (pas de broadcast) et reception de message (reception par un broadcast)
    */
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
      socket.join(room);
      console.log("Rooms: ", socket.rooms);
    });

/*
    socket.on('login',  async (cb) => {
      try {
        console.log("Inside socket");
        const { privateKey, publicKey } = generateUserKeyPair();
        // TODO encrypt private key
        await cb({ privateKey, publicKey }); // callback
      } catch (error) {
        console.error("Error during login:", error.message);
        // TODO Handle error?
      }
    });
*/

    socket.on('send_message', (message, userData, conversationId, socketId, cb) => {
      const user = userData;
      console.log("send_message event");
      /* encryption

      console.log('Received encrypted message:', encryptedMessage);

      const decryptedContent = privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(encryptedMessage.message, 'base64')
      );

      const decryptedMessage = {
        ...encryptedMessage,
        message: decryptedContent.toString(),
      };

      console.log('Decrypted message:', decryptedMessage);

      */

      // register message in db
      console.log("New message received:", message);
      const formattedMessage = { id: message.id, content: message.message, id_user: user.id, id_group: Number(conversationId), created_at: message.timestamp, send_at: message.timestamp };
      //console.log("Sending save_message event");
      //socket.to(socketId).emit("save_message", formattedMessage, conversationId, userData, socketId);
      console.log("Sending receive_message event");
      socket.broadcast.emit("receive_message", formattedMessage);
      console.log("receive_message event finished");
      cb(formattedMessage);
    });

    /*socket.on('message', (message) => {
          console.log('Received message:', message);
          broadcastMessage(message);
      });*/

    socket.on('save_group',  (newUserGroup, newGroups) => {
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

  const broadcastMessage = (message) => {
    if (io) {
      io.to(message.conversationId).emit('message', message);
    }
  };
});




//module.exports = { broadcastMessage };
