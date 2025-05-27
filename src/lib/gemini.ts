import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export const getGeminiResponse = async (prompt: string) => {
  try {
    // For chat models, you typically start a chat session and then send messages
    const chat = model.startChat({
        history: [], 
        generationConfig: {
            maxOutputTokens: 200, // Adjust as needed for summary length
        },
    });

    const result = await chat.sendMessage(prompt); // Send the combined prompt
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    throw new Error("Failed to get response from Gemini AI.");
  }
};