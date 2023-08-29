import { v2 as cloudinary } from 'cloudinary';
import { api, badRequest, successHandler } from '../utils/axios';

export const handler = api(
  async (req, res) => {
    const body = JSON.parse(req.body) || {};
    console.log('cld: body', body);
    const { paramsToSign } = body;
    console.log('process.env.CLOUDINARY_API_SECRET', process.env.CLOUDINARY_API_SECRET);
    if (!process.env.CLOUDINARY_API_SECRET) {
      console.error('Not found CLOUDINARY_API_SECRET');
      return badRequest(res);
    }
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
    return successHandler(res, { signature });
  },
  ['POST'],
);
