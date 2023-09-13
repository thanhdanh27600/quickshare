import azure from 'azure-storage';

export const blobService = azure.createBlobService(
  process.env.AZURE_STORAGE_ACCOUNT!,
  process.env.AZURE_STORAGE_ACCESS_KEY!,
);

export const AZURE_PERMISSION = azure.BlobUtilities.SharedAccessPermissions;
