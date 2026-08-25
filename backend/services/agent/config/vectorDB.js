import { QdrantVectorStore } from "@langchain/qdrant";
import embeddings from "./embeddings.js";
import "dotenv/config";

const vectorStore = async (documents, collectionName) => {
  return await QdrantVectorStore.fromDocuments(documents, embeddings, {
    collectionName: collectionName,
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });
};

export default vectorStore;
