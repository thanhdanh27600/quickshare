import CryptoJS from 'crypto-js';
import { PLATFORM_AUTH, SERVER_AUTH } from 'types/constants';

export const decrypt = (token: string) => {
  let decrypted = '';
  if (PLATFORM_AUTH) {
    const bytes = CryptoJS.AES.decrypt(token, PLATFORM_AUTH);
    decrypted = bytes.toString(CryptoJS.enc.Utf8).split('###')[0];
  }
  return decrypted;
};

export const encrypt = (word: string) => {
  let encrypted = '';
  if (PLATFORM_AUTH) {
    encrypted = CryptoJS.AES.encrypt(word + '###' + new Date().getTime(), PLATFORM_AUTH).toString();
  }
  return encrypted;
};

export const decryptS = (token: string) => {
  let decrypted = '';
  if (SERVER_AUTH) {
    const bytes = CryptoJS.AES.decrypt(token, SERVER_AUTH);
    decrypted = bytes.toString(CryptoJS.enc.Utf8).split('###')[0];
  }
  return decrypted;
};

export const encryptS = (word: string) => {
  let encrypted = '';
  if (SERVER_AUTH) {
    encrypted = CryptoJS.AES.encrypt(word + '###' + new Date().getTime(), SERVER_AUTH).toString();
  }
  return encrypted;
};
