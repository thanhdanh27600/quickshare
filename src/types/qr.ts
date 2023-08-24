import { Response } from './api';

export type QR = Response & {
  qr?: string;
};
