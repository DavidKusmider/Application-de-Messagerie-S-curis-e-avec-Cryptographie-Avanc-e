"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const { Server } = require('socket.io');
var socket_io_1 = require("socket.io");
//const express = require('express');
var https = __importStar(require("https"));
var next_1 = __importDefault(require("next"));
var fs_1 = require("fs");
//const http = require('http');
var dev = process.env.NODE_ENV !== 'production';
var app = (0, next_1.default)({ dev: dev });
var handle = app.getRequestHandler();
var PORT = process.env.PORT || 3001;
var privateKeyPath = "./certificates/private-key.pem";
var certificatePath = "./certificates/certificate.pem";
var privateKey = (0, fs_1.readFileSync)(privateKeyPath, 'utf8');
var certificate = (0, fs_1.readFileSync)(certificatePath, 'utf8');
var credentials = { key: privateKey, cert: certificate };
app.prepare().then(function () {
    var server = https.createServer(credentials, function (req, res) {
        // Vos logiques de routage pour Next.js peuvent être ajoutées ici si nécessaire
        handle(req, res);
    });
    /*
      l'utilisateur dui envoie un message, envoie son message en BDD et l'ajoute à sa liste de message en statique (déjà) => ne plus utilisé le broadcast lors d'envoie de message
      Utiliser le broadcast pour envoyer le message statique, déjà ecrit en BDD, aux autres utilisateurs sans d'appel BDD supplementaire
      TLD;DR : séparer envoie (pas de broadcast) et reception de message (reception par un broadcast)
      */
    var io = new socket_io_1.Server(server, {
        cors: {
            origin: ["https://localhost:3000"], // Client URL
            //methods: ["GET", "POST"]
        }
    });
    io.engine.on("connection_error", function (err) {
        console.log(err.req); // the request object
        console.log(err.code); // the error code, for example 1
        console.log(err.message); // the error message, for example "Session ID unknown"
        console.log(err.context); // some additional error context
    });
    io.on('connection', function (socket) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(socket.id + ' connected');
            console.log(io.engine.clientsCount);
            socket.on('joinRoom', function (room) {
                console.log("Joining room:", room);
                socket.join(room);
                console.log("Rooms: ", socket.rooms);
            });
            socket.on('send_message', function (message, userData, conversationId, socketId, cb) {
                var user = userData.user;
                console.log("send_message event");
                // register message in db
                console.log("New message received:", message);
                var formattedMessage = { id: message.id, content: message.message, id_user: user.id, id_group: Number(conversationId), created_at: message.timestamp, send_at: message.timestamp };
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
            socket.on('disconnect', function () {
                console.log('WebSocket disconnected');
            });
            return [2 /*return*/];
        });
    }); });
    server.listen(PORT, function () {
        console.log("Server is running on port ".concat(PORT));
    });
    var broadcastMessage = function (message) {
        if (io) {
            io.to(message.conversationId).emit('message', message);
        }
    };
});
//module.exports = { broadcastMessage };
