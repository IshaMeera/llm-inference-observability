const axios = require('axios');
const {redact} = require("../utility/redact.js");

async function trackInference(callback, metadata) {
    console.log("TRACK START");
    console.log(metadata);
    const start = Date.now();

    try{

        //store user input
        try{
        await axios.post(process.env.CHAT_INGESTION_SERVICE_URL, {
            sessionId: metadata.sessionId,
            role: "user",
            content: redact(metadata.input),
            sequence: metadata.sequence || 1
        });
        }catch(err){
            console.error("Error storing user input: ", err);
        }

        //call llm
        const result = await callback();

        //store llm output
        try{
        await axios.post(process.env.CHAT_INGESTION_SERVICE_URL, {
            sessionId: metadata.sessionId,
            role: "assistant",
            content: redact(result.text),
            sequence: metadata.sequence || 2
        });
        }catch(err){
            console.error("Error storing llm output: ", err);
        }

        const log = {
            ...metadata,
            input: redact(metadata.input),
            latency: Date.now() - start,
            tokenUsage: result.tokenUsage || 0,
            inputPreview: redact(metadata.input) ? redact(metadata.input).slice(0, 100) : '',
            outputPreview: redact(result.text) ? redact(result.text).slice(0, 100) : '',
            status: "success",
            timestamp: new Date(),
        }
        console.log('Inference Log:', log);

        await axios.post(process.env.INGESTION_SERVICE_URL, log);
        return result;

    }catch (error) {
        console.error('Inference Error:', error);
        const log = {
            ...metadata,
            latency: Date.now() - start,
            status: "error",
            error: error.message,
            timestamp: new Date(),
        }
        console.log('Inference Log:', log);
        
        await axios.post(process.env.INGESTION_SERVICE_URL, log);
        throw error;
    }
}

module.exports = {
    trackInference
}