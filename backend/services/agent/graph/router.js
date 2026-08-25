import { getModel } from "../config/llmModels.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

  if (state.file) {
    if (state.file?.mimetype === "application/pdf") {
      return {
        ...state,
        agent: "pdfRag",
      };
    }

    if (state.file?.mimetype?.startsWith("image/")) {
      return {
        ...state,
        agent: "imageAnalyzer",
      };
    }
  }

  const llm = getModel("router");

  const prompt = `
You are an AI Router for a multimodal creative platform.
Your job is to analyze a user's request and decide which agent to use.

### Available Agents:
1.  **chat**: For general conversation, Q&A, and text-based tasks.
2.  **search**: When the user needs current information, web search, or real-time data.
3.  **coding**: For writing, debugging, or explaining code.
4.  **imageGen**: For creating images, illustrations, or visual designs.
5.  **pdf**: For analyzing, summarizing, or generating PDF documents.
6.  **ppt**: For creating or editing PowerPoint presentations.

### Routing Logic:
1.  Identify the user’s main goal.
2.  Choose the best agent based on the available tools and context.
3.  Return only the agent name (e.g., "chat", "search", "coding", "pdf").

### Special Cases:
-   If the user asks for code → use 'coding'.
-   If the user asks for an image → use 'imageGen'.
-   If the user needs to search the web or get current info → use 'search'.
-   If the user wants to chat or ask general questions → use 'chat'.
-   If the user wants PDF, PPT or image generation → use the respective agent.
-   If the request is unclear, default to 'chat'.

### Output Format:
Return only one word: the name of the agent.

### User Query:${state.prompt}
`;

  const response = await llm.invoke(prompt);

  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
