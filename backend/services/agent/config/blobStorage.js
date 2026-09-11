import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

// Create the connection using the connection string we will provide later
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
export const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// We define the "Container" (Azure's word for Bucket) here
export const containerName = process.env.AZURE_CONTAINER_NAME || "bratai-files";
