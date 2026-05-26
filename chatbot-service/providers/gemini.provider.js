const { GoogleGenAI } = require("@google/genai");
const {trackInference} = require( "../wrapper/llm.wrapper" );

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// console.log(
//   "KEY PREFIX:",
//   process.env.GEMINI_API_KEY?.slice(0, 15)
// );

async function generate(messages) {
    const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    const response = await trackInference(
    async () => {
        return await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `

        You are an AI Liability Risk Assistant.

        Your job is to help users evaluate AI system risks.

        Rules:

        1. If the user sends greetings or casual conversation
        (hi, hello, thanks, how are you),
        respond naturally.

        2. Only perform detailed risk analysis
        when the user asks about:
        - AI systems
        - hiring
        - safety
        - hallucination
        - privacy
        - compliance
        - bias
        - governance
        - mitigation

        3. When performing analysis:
        cover only relevant categories:
        - hallucination risk
        - bias risk
        - privacy risk
        - regulatory concerns

        4. Keep responses concise.

        Conversation:

        ${conversation}

        `
        
        });
    },

    {
        provider: "gemini",
        model: "gemini-2.5-flash",
        sessionId: messages[0]?.sessionId || "unknown",
        input: conversation
    }
    );

    console.log(response);

    return {
        text: response.text,
        tokenUsage: {total: response.usageMetadata?.totalTokenCount}
    }
}

async function generateStream(messages){
    const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    return await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: `You are an AI Liability Risk Assistant.
        Conversation: ${conversation}`
    });
}

module.exports = {
    generate,
    generateStream
};