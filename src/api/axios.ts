import axios from 'axios';
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL, alternateBrandUrl, brandUrl, brandUrlShort } from '../types/constants';

export const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // server reponse error
    if (err.response?.data?.errorMessage) throw new Error(err.response.data.errorMessage);
    // internal error
    throw new Error(err);
  },
);

export function withAuth(token?: string) {
  return {
    'X-Platform-Auth': token ?? localStorage.getItem('clickdi-tk'),
  };
}

const cors = Cors({
  origin: [brandUrl, brandUrlShort, ...alternateBrandUrl],
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
});

export const allowCors = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  cors(req, res, async () => {
    return await handler(req, res);
  });
};
