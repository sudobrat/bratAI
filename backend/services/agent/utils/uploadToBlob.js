import { blobServiceClient, containerName } from "../config/blobStorage.js";

export const uploadToBlob = async (fileName, buffer, contentType) => {
    // 1. Get a reference to our container (bucket)
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // 2. Azure is smart - if the container doesn't exist yet, this automatically creates it!
    await containerClient.createIfNotExists();

    // 3. Create a reference to the specific file we want to upload
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // 4. Upload the file (buffer) and tell Azure what type of file it is
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: contentType },
    });

    return blockBlobClient.url;
};
