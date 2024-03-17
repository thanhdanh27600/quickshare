import { logEvent } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';
import { analytics } from 'utils/firebase';

export const enum EVENTS_STATUS {
  'FAILED' = 'FAILED',
  'INTERNAL_ERROR' = 'INTERNAL ERROR',
  'OK' = 'OK',
}

const EVENTS = {
  HOMEPAGED: 'Homepaged',
  SHORTEN: 'Shorten',
  SHORTEN_MORE: 'Shorten Another',
  NOTE_LANDED: 'Note Landed',
  UPLOAD_LANDED: 'Upload Landed',
  NOTE_GET: 'Note Get',
  NOTE_CREATE: 'Note Create',
  NOTE_UPDATE: 'Note Update',
  NOTE_MORE: 'Create Another Note',
  FILE_CREATE: 'File Create',
  File_MORE: 'Upload Another File',
  SHORTEN_UPDATE: 'Update Shorten',
  INPUT_STATS: 'Input Stats',
  LINK_COPY: 'Link Copy',
  USER_AGENT_COPY: 'User Agent Copy',
  FORWARD: 'Forward',
  DONATE: 'Donate',
  TRACKING: 'Tracking',
  OPEN_SET_PASSWORD: 'Open Set Password',
  SET_PASSWORD: 'Set Password',
  INPUT_URL: 'Input URL',
  CONTACT: 'Contact',
  TERMS: 'Terms of Service',
  PRIVACY: 'Privacy Policy',
  SIGN_IN: 'Sign in',
  SIGN_OUT: 'Sign out',
  CRASH: 'CRASH',
  CLOSE_MODAL: 'Close Modal',
} as const;

export const MIXPANEL_EVENT = EVENTS;
export const FIREBASE_ANALYTICS_EVENT = EVENTS;

export const trackLanded = () => {
  if (typeof location === 'undefined') return;
  if (location.pathname === '/') {
    mixpanel.track(MIXPANEL_EVENT.HOMEPAGED);
    logEvent(analytics, FIREBASE_ANALYTICS_EVENT.HOMEPAGED);
  }
};
