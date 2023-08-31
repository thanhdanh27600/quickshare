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
      const tokens = bytes.toString(CryptoJS.enc.Utf8).split('###');
      decrypted = tokens[0];
      const createdAt = Number(tokens[1]);
    }
    return decrypted;
  } catch (error) {
    logger.error(error);
    return '';
  }
};

export const encryptS = (word: string) => {
  let encrypted = '';
  if (SERVER_AUTH) {
    encrypted = CryptoJS.AES.encrypt(word + '###' + new Date().getTime(), SERVER_AUTH).toString();
  }
  return encrypted;
};

export function encodeToBase64(input: string): string {
  const buffer = Buffer.from(input);
  return buffer.toString('base64');
}

export function decodeFromBase64(input: string) {
  const buffer = Buffer.from(input, 'base64');
  return buffer.toString('utf-8');
}

export function isValidBase64(input: string) {
  try {
    const buffer = Buffer.from(input, 'base64');
    const decodedString = buffer.toString('utf-8');
    const reencodedString = Buffer.from(decodedString).toString('base64');
    return reencodedString === input;
  } catch (error) {
    return false;
  }
}
