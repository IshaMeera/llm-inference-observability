
const {trackInference} = require( "../wrapper/llm.wrapper" );
const {getProvider} = require("../providers");

async function askRiskAssistant(messages, providerName = "gemini") {

   console.log("REQUESTED PROVIDER:", providerName);

   const generator = getProvider(providerName);

   console.log(
     "GENERATOR:",
     generator?.generate?.name
   );

   return await generator.generate(messages);
}

module.exports = {
    askRiskAssistant
};