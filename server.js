const express = require('express');
const app = express();
const messagesRouter = require('./messages');

app.use('/api/messages', messagesRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
