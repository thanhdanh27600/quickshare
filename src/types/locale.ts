export enum Locale {
  Vietnamese = 'vi',
  English = 'en',
}

export type LocaleProp = { locale: Locale };

export const locales = {
  [Locale.English]: Locale.English,
  [Locale.Vietnamese]: Locale.Vietnamese,
} as const;

export const regions = {
  [Locale.Vietnamese]: 'vi_VN',
  [Locale.English]: 'en_US',
} as const;

export const languages = {
  [Locale.English]: 'English',
  [Locale.Vietnamese]: 'Tiếng Việt',
} as const;

export type Locales = keyof typeof locales;

export type Languages = keyof typeof Locale;
