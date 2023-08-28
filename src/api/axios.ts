import axios from 'axios';
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

const allowedOrigins = [brandUrl, brandUrlShort, ...[alternateBrandUrl]];

export const allowCors = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  const origin = req.headers['origin'];
  console.log('origin', origin);
  if (!!origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await handler(req, res);
};
