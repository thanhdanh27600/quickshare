import { isProduction } from '../../../types/constants';
import { api, badRequest, successHandler } from '../../../utils/axios';
import { AZURE_PERMISSION, blobService } from '../../../utils/azure';

// Configure Azure Blob Storage with your account information

const handler = api(
  async (req, res) => {
    const { fileName, fileType } = req.query;

    if (!fileName) return badRequest(res);

    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;
    const blobName = `${isProduction ? 'anonymous' : 'local'}/${fileName}`;

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 5);

    const sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: AZURE_PERMISSION.WRITE,
        Start: startDate,
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
