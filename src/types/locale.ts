export enum Locale {
  Vietnamese = 'vi',
  English = 'en',
}

export type LocaleProp = { locale: Locale };

export const locales = {
  [Locale.Vietnamese]: Locale.Vietnamese,
  [Locale.English]: Locale.English,
} as const;
export const languages = {
  [Locale.Vietnamese]: 'Tiếng Việt',
  [Locale.English]: 'English',
} as const;

export type Locales = keyof typeof locales;

export type Languages = keyof typeof Locale;
