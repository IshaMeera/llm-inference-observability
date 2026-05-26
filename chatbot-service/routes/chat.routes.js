const express = require('express');
const router = express.Router();
const { askRiskAssistant } = require('../services/llm.service');
const { getHistory, saveMessage } = require('../memory/conversation.store');
const { generateStream } = require('../providers/gemini.provider');
const { getProvider } = require('../providers/index');
const { trackInference } = require("../wrapper/llm.wrapper");

router.post("/", async (req, res) => {
    try{
        const {message, sessionId, provider = "gemini"} = req.body;

        saveMessage(sessionId, "user", message);

        const history = getHistory(sessionId);

        const result = await askRiskAssistant(history, provider);

        saveMessage(sessionId, "assistant", result.text);
        res.json({reply: result.text});

    }catch(error){

        console.error("Error in /chat route:", error);
        res.status(500).json({error: "An error occurred while processing your request. AI failed to generate a response."});
    
    }
});

router.post("/stream", async (req, res) => {
    try{
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');

        const{message, sessionId, provider = "gemini"} = req.body;

        saveMessage(sessionId, "user", message);

        const history = getHistory(sessionId);

        const generator = getProvider(provider);

        const stream = await generator.generateStream(history);

        let finalResponse = "";

        for await (const chunk of stream) {

            console.log("Received chunk:", chunk);

            let text = "";
            if(provider === "grok"){

            text = chunk?.choices[0]?.delta?.content || "";
            } else {
                text = chunk?.text || "";
            }

            if(!text) continue;

            finalResponse += text;

            res.write(`data: ${text}\n\n`);
        }

        saveMessage(sessionId, "assistant", finalResponse);

        await trackInference(
             async () => ({finalResponse, tokenUsage: 0
        }),
        {
            provider,
            model: provider === "grok" ? "grok-4" : "gemini-2.5-flash",
            sessionId,
            input: message,
        }
        );
        res.end();
    }catch(error){
        
        console.error("Error in /chat/stream route:", error);
        res.status(500).json({
            error: "An error occurred while processing your request. AI failed to generate a response."
        });
    }
});

module.exports = router;