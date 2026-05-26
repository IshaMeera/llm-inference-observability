require("dotenv").config();

const { GoogleGenAI } =
require("@google/genai");

const ai =
new GoogleGenAI({
  apiKey:
    process.env.GEMINI_API_KEY,
});

async function run() {

  try {

    const res =
      await ai.models.generateContent({

        model:
          "gemini-2.5-flash",

        contents:
          "hello"

      });

    console.log(
      res.text
    );

  } catch (e) {

    console.log(
      e.message
    );

  }

}

run();