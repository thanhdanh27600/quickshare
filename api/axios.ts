import axios from 'axios';
import { BASE_URL } from 'types/constants';

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
