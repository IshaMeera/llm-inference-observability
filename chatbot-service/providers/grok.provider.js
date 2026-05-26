const OpenAI = require("openai");
const { trackInference } = require("../wrapper/llm.wrapper");

const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function generate(messages) {

  console.log("ENTERED GROK");

  const conversation = messages.map(msg =>`${msg.role}: ${msg.content}`).join("\n");

  console.log("BEFORE TRACK");

  const result = await trackInference(

      async () => {

        const response = await client.chat.completions.create({

              model: "grok-4",
              messages: [{ role: "user", content: conversation}],
            });

        return {
          text: response.choices[0].message.content,
          tokenUsage: response.usage?.total_tokens || 0,
        };
      },

      {
        provider: "grok",
        model: "grok-4",
        sessionId: messages[0]?.sessionId || "unknown",
        input: conversation,
      }
    );

  return result;

}

async function generateStream(messages){
    const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    return await client.chat.completions.create({
        model: "grok-4",
        stream: true,
        messages: [{ role: "user", content: conversation }]
    });
}

module.exports = {
  generate,
  generateStream
};