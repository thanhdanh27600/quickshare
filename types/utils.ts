import mixpanel from 'mixpanel-browser';

export const enum MIXPANEL_STATUS {
  'FAILED' = 'FAILED',
  'INTERNAL_ERROR' = 'INTERNAL ERROR',
  'OK' = 'OK',
}

export const MIXPANEL_EVENT = {
  HOMEPAGED: 'Homepaged',
  SHORTEN: 'Shorten',
  INPUT_STATS: 'Input Stats',
  LINK_COPY: 'Link Copy',
  FORWARD: 'Forward',
  INPUT_URL: 'Input URL',
} as const;

export const trackLanded = () => {
  if (typeof location === 'undefined') return;
  if (location.pathname === '/') {
    mixpanel.track(MIXPANEL_EVENT.HOMEPAGED);
  }
};
