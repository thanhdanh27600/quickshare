import { api, badRequest, successHandler } from '../../../utils/axios';
import { AZURE_PERMISSION, blobService } from '../../../utils/azure';

const handler = api(
  async (req, res) => {
    const { fileName } = req.query;

    if (!fileName) return badRequest(res);

    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;
    const blobName = `anonymous/${fileName}`;

    // Set the expiration time for the URL (e.g., 1 hour)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: AZURE_PERMISSION.READ,
        Start: new Date(),
        Expiry: expiryDate,
      },
    };

    const token = blobService.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);

    const url = blobService.getUrl(containerName, blobName, token, true);

    return successHandler(res, { url });
  },
  ['GET'],
);

export default handler;
