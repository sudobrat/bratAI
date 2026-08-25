import { TavilySearch } from "@langchain/tavily";

const searchTool = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 5,
  topic: "general",
  includeImages: true,
});

export default searchTool;
