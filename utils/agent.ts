import { UAParser } from 'ua-parser-js';

export enum Referer {
  ZALO = 'ZALO',
  FACEBOOK_MESSENGER = 'FACEBOOK_MESSENGER',
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

export function detectReferer(userAgent: string): Referer {
  const ua = userAgent.toLowerCase();
  const uaParsed = UAParser(userAgent);
  let check = false;
  // TIKTOK
  check = ua.includes('tiktok') || ua.includes('bytel') || ua.includes('bytefulll');
  if (check) return Referer.TIKTOK;

  //ZALO
  check = ua.includes('zalo') || ua.includes('zalotheme') || ua.includes('zalolanguage');
  if (check) return Referer.ZALO;

  //INSTAGRAM
  check = ua.includes('zalo') || ua.includes('zalotheme') || ua.includes('zalolanguage');
  if (check) return Referer.INSTAGRAM;

  //FACEBOOK_MESSENGER
  check = ua.includes('messenger') || ua.includes('fbav') || uaParsed.browser?.name?.toLowerCase() === 'facebook';
  if (check) return Referer.FACEBOOK_MESSENGER;

  //DIRECT
  let browserName = uaParsed.browser?.name?.toLowerCase() || '-1';
  check = ['chrome', 'safari', 'firefox', 'brave', 'opera', 'chromium', 'microsoft edge', 'edge'].includes(browserName);
  if (check) return Referer.DIRECT;

  return Referer.UNKNOWN;
}

export function detectCrawler(userAgent: string): Crawler {
  const ua = userAgent.toLowerCase();
  console.log('ua detectCrawler', ua);
  let check = false;

  check = ua.includes('facebookexternalhit') || ua.includes('facebook.com/externalhit');
  if (check) {
    return Crawler.FACEBOOK;
  }
  return Crawler.OTHER;
}
