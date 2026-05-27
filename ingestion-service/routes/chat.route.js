const express = require('express');
const router = express.Router();

const Chat = require('../models/chat.model.js');

router.post("/", async (req, res) => {
    try{
        await Chat.create(req.body);
        console.log("Received chat data: ", req.body);
        res.status(201).json({ message: "Chat data received and stored successfully." });
    }catch(err){
        console.error("Error storing chat data: ", err);
        res.status(500).json({ message: "Failed to store chat data." });
    }
});

router.get("/:sessionId", async(req, res) => {
        try{
        const chats = await Chat.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
        return res.json(chats);
        }catch(err){
            console.error("Error fetching chat history:", err);
            return res.status(500).json({ error: "Failed to fetch chat history" });
        }
    }
);
module.exports = router;