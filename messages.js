const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

let messages = [];

// API endpoint for posting a new message
router.post('/', (req, res) => {
    const { message, image, conversationId } = req.body;
    console.log("received message: " + message);

    if (!message && !image) {
        return res.status(400).json({ error: 'Message or image is required' });
    }

    const newMessage = {
        id: messages.length + 1,
        message,
        image,
        conversationId,
        timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // You might want to broadcast this message to other clients in the conversation using a WebSocket or similar
    // Example: pusher.trigger('messages', 'new', newMessage);

    res.status(201).json(newMessage);
});

// TODO more API endpoints for editing, deleting messages etc.

module.exports = router;
