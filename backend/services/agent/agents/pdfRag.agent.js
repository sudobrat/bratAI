import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import vectorStore from "../config/vectorDB.js";
import { deductCredits } from "../utils/deductCredits.js";
import { getModel } from "../config/llmModels.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRagAgent = async (state) => {
  try {
    await checkAgentLimit("pdf", state.userId);
    const buffer = await fs.readFile(state.file.path);
    const pdf = new PDFParse(new Uint8Array(buffer));

    const result = await pdf.getText();
    const text = result.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 500,
    });

    const docs = await splitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;

    const store = await vectorStore(docs, collectionName);

    const relevantDocs = await store.similaritySearch(state.prompt);

    const context = relevantDocs.map((doc) => doc.pageContent).join("\n");

    const llm = getModel("pdfRag");

    const messages = [
      new SystemMessage(
        `You are bratAI pdf rag Agent.
Rules:

- Answer only from the uploaded PDF.
- Answer the user's question accurately.
- Never make up information.
- If the answer is not present in the PDF, reply: "I don't have enough information to answer this question."
- Use Markdown formatting
- Do not hallucinate.`,
      ),

      new HumanMessage(`Context:${context}, Question:${state.prompt}`),
    ];

    const response = await llm.invoke(messages);
    await deductCredits(state.userId, "pdf");
    return {
      ...state,
      aiResponse: response?.content,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to analyze PDF",
    };
  } finally {
    if (state.file?.path) {
      await fs
        .unlink(state.file.path)
        .catch((err) => console.error("Failed to delete temp file:", err));
    }
  }
};
