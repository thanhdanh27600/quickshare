import { Response } from 'utils/axios';

export type QR = Response & {
  qr?: string;
};
