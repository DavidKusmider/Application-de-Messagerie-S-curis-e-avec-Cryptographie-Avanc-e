const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const { broadcastMessage } = require('./socket'); // Import the broadcastMessage function from your socket file

router.use(bodyParser.json());
router.use(cors());

// API endpoint for posting a new message
router.post('/', (req, res) => {
    const { message, image, conversationId } = req.body;
    console.log("received message: " + message);

    if (!message && !image) {
        return res.status(400).json({ error: 'Message or image is required' });
    }

    const newMessage = {
        id: Date.now().toString(), // unique identifier for the message, TODO find a better one
        message,
        image,
        conversationId,
        timestamp: new Date().toISOString(),
    };

    broadcastMessage(newMessage);

    res.status(201).json(newMessage);
});

// TODO more API endpoints for editing, deleting messages, etc.

module.exports = router;
