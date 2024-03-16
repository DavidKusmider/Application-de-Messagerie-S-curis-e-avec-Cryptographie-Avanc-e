const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { initWebSocket } = require('./socket');

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

initWebSocket(server);
