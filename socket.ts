//const { Server } = require('socket.io');
import {Server} from "socket.io";
import express from 'express';
//const express = require('express');
import * as http from "http";
//const http = require('http');
import messagesRouter from './messages';

//const app = express();
const server = http.createServer();
//app.use('/api/messages', messagesRouter);

const PORT = process.env.PORT || 3001;

/*
l'utilisateur dui envoie un message, envoie son message en BDD et l'ajoute à sa liste de message en statique (déjà) => ne plus utilisé le broadcast lors d'envoie de message
Utiliser le broadcast pour envoyer le message statique, déjà ecrit en BDD, aux autres utilisateurs sans d'appel BDD supplementaire
TLD;DR : séparer envoie (pas de broadcast) et reception de message (reception par un broadcast)
*/

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"], // Client URL
        //methods: ["GET", "POST"]
    }
});

io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
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

    socket.on('send_message', (message: any, userData: any, conversationId: string, socketId: string, cb) => {
       const user = userData.user;
       console.log("send_message event");
       // register message in db
        console.log("New message received:", message);
        const formattedMessage: any = {id: message.id, content:message.message, id_user: user.id, id_group: Number(conversationId), created_at: message.timestamp, send_at: message.timestamp};
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

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });
});


server.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});

export const broadcastMessage = (message: any) => {
    if (io) {
        io.to(message.conversationId).emit('message', message);
    }
};

//module.exports = { broadcastMessage };