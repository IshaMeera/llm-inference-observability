const gemini = require("./gemini.provider");
const grok = require("./grok.provider");

function getProvider(provider){

     console.log(
      "FACTORY RECEIVED:",
      provider
    );

    switch(provider){
        case "gemini":
            return gemini;
        case "grok":
            return grok;
        default:
            return gemini;
    }
}

module.exports = {
    getProvider
};