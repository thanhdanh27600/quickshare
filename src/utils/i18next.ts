import { TOptions } from 'i18next';
import { useTranslation } from 'next-i18next';
import { UseTranslationOptions } from 'react-i18next';
import common from '../../public/locales/vi/common.json';
import { BASE_URL } from '../types/constants';
import { Locale, Locales, locales } from '../types/locale';

export type LanguageNamespaces = {
  common: keyof typeof common;
};

export type SingleNamespace<K extends keyof LanguageNamespaces> = LanguageNamespaces[K];

export function useTrans<K extends keyof LanguageNamespaces>(namespace?: K | K[], options?: UseTranslationOptions<K>) {
  // @ts-ignore
  const { t, i18n } = useTranslation(namespace, options);
  const locale: Locale = locales[i18n.language as Locales];
  return {
    t: (key: SingleNamespace<K>, options?: object | TOptions) => t(key, options || {}),
    i18n,
    locale,
  };
}

export const defaultLocale = Locale.Vietnamese;

export function linkWithLanguage(href: string, locale: Locale) {
  if (locale === defaultLocale) {
    return href;
  }
  return href.replaceAll(BASE_URL, `${BASE_URL}/${locale}`);
}

export function getLanguage(href: string) {
  if (href.trim().length === 0) return defaultLocale;
  if (!href.includes(BASE_URL)) return defaultLocale;
  const tokens = href.replaceAll(BASE_URL, '').split('/');
  if (!tokens[1] || tokens[1].length !== 2) return defaultLocale;
  const localeToken = tokens[1] as Locale;
  const locale = locales[localeToken] ?? defaultLocale;
  return locale;
}
