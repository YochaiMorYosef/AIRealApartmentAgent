const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
console.log(process.env.GEMINI_API_KEY ? "✅ Gemini API Key Loaded" : "❌ Missing API Key");

const SYSTEM_PROMPT = `
    You are an AI real estate agent for Israeli apartments.

    IMPORTANT RULES:

    - Always answer ONLY in Hebrew.
    - Never answer in English.
    - The user is from Israel.
    - Help the user find apartments.
    - Be short and friendly.
    - If information is missing, ask follow-up questions in Hebrew.
    - When apartment search is needed, call the searchApartments tool.
    - Never invent apartments.
    - Base your answers only on the returned search results.
`;

async function askGemini(conversation, tool){

    return await ai.models.generateContent({
        model:"gemini-2.5-flash",

        contents: conversation,

        config:{
            systemInstruction: SYSTEM_PROMPT,
            tools:[
                {
                    functionDeclarations:[
                        tool
                    ]
                }
            ]
        }

    });

}

module.exports = {
    askGemini
};