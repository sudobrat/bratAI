import searchTool from "../config/tavily.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const searchAgent = async (state) => {
  try {
    await checkAgentLimit("search", state.userId);
    const results = await searchTool.invoke({
      query: state.prompt,
    });
    await deductCredits(state.userId, "search");

    return {
      ...state,
      searchResults: results,
      images: results.images,
    };
  } catch (error) {
    return {
      ...state,
      searchResults: [],
      images: [],
      aiRespone: error?.data?.message || "Failed to search",
    };
  }
};
