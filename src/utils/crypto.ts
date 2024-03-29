import base64url from 'base64url';
import CryptoJS from 'crypto-js';
import { PLATFORM_AUTH, SERVER_AUTH } from '../types/constants';
import { logger } from './logger';

export const decrypt = (token: string) => {
  try {
    let decrypted = '';
    if (PLATFORM_AUTH) {
      const bytes = CryptoJS.AES.decrypt(token, PLATFORM_AUTH);
      decrypted = bytes.toString(CryptoJS.enc.Utf8).split('###')[0];
    }
    return decrypted;
  } catch (error) {
    logger.error(error);
    return '';
  }
};

export const encrypt = (word: string) => {
  let encrypted = '';
  if (PLATFORM_AUTH) {
    encrypted = CryptoJS.AES.encrypt(word + '###' + new Date().getTime(), PLATFORM_AUTH).toString();
  }
  return encrypted;
};

export const decryptS = (token: string) => {
  try {
    let decrypted = '';
    if (SERVER_AUTH) {
      const bytes = CryptoJS.AES.decrypt(token, SERVER_AUTH);
      const tokens = bytes.toString(CryptoJS.enc.Utf8);
      const parsed = JSON.parse(tokens);
      decrypted = parsed.text;
      const createdAt = new Date(parsed.at);
    }
    return decrypted;
  } catch (error) {
    logger.error(error);
    return '';
  }
};

/** use for server only */
export const encryptS = (text: string) => {
  let encrypted = '';
  if (SERVER_AUTH) {
    encrypted = CryptoJS.AES.encrypt(
      JSON.stringify({
        text,
        at: new Date().getTime(),
      }),
      SERVER_AUTH,
    ).toString();
  }
  return encrypted;
};

export const encodeBase64 = base64url.encode;
export const decodeBase64 = base64url.decode;
