const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const messagesRouter = require('./messages');
const { initWebSocket } = require('./socket');

app.use('/api/messages', messagesRouter);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

initWebSocket(server);
