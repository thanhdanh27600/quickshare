import geoIp from 'geoip-country';
import { logger } from './logger';

export enum Referer {
  ZALO = 'ZALO',
  LINKEDIN = 'LINKEDIN',
  FACEBOOK = 'FACEBOOK',
  SHARE_LINK = 'SHARE LINK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  GOOGLE = 'GOOGLE',
  DIRECT = 'DIRECT',
  UNKNOWN = 'UNKNOWN',
}

export enum Crawler {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  OTHER = 'OTHER',
}

export function isMobile(userAgent: string) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export function isDesktop(userAgent: string): boolean {
  return /Macintosh|Windows|Linux/i.test(userAgent) && !/Mobile|Tablet/i.test(userAgent);
}

export const ipLookup = (ip: string) => {
  let lookupIp;
  if (ip) {
    lookupIp = geoIp.lookup(ip);
  }

  if (!lookupIp) {
    logger.warn(!ip ? 'ip not found' : `geoIp cannot determined ${ip}`);
  }
  return lookupIp;
};
