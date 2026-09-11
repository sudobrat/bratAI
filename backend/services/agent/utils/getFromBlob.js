import { blobServiceClient, containerName } from "../config/blobStorage.js";
import { generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";

export const getFromBlob = async (fileName, expiresInSeconds = 600) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    // 1. Configure the security settings (Read-only, expires in X minutes)
    const sasOptions = {
        containerName,
        blobName: fileName,
        permissions: BlobSASPermissions.parse("r"), // "r" means Read Only
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + expiresInSeconds * 1000),
    };

    // 2. Generate the secure cryptographic token
    const sasToken = generateBlobSASQueryParameters(sasOptions, blobServiceClient.credential).toString();

    // 3. Attach the token to the end of the file URL
    return `${blobClient.url}?${sasToken}`;
};
