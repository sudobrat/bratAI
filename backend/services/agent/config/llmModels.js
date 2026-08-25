import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

const openRouter = new ChatOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-chat",
  temperature: 0,
});

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
});

const gemini = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.5-flash-lite",
});

export const getModel = (agent) => {
  switch (agent) {
    case "router":
      return groq;
    case "chat":
      return gemini;
    case "search":
      return gemini;
    case "coding":
      return openRouter;
    case "pdf":
      return groq;
    case "ppt":
      return gemini;
    case "imageGen":
      return gemini;
    case "imageAnalyzer":
      return gemini;
    default:
      return groq;
  }
};
