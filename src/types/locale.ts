export enum Locale {
  Vietnamese = 'vi',
  English = 'en',
  French = 'fr',
  Chinese = 'zh',
  Japanese = 'ja',
  Hindi = 'hi',
}

export type LocaleProp = { locale: Locale };

export const locales = {
  [Locale.English]: Locale.English,
  [Locale.Vietnamese]: Locale.Vietnamese,
  [Locale.French]: Locale.French,
  [Locale.Chinese]: Locale.Chinese,
  [Locale.Japanese]: Locale.Japanese,
  [Locale.Hindi]: Locale.Hindi,
} as const;

export const regions = {
  [Locale.Vietnamese]: 'vi_VN',
  [Locale.English]: 'en_US',
  [Locale.French]: 'fr_FR',
  [Locale.Chinese]: 'zh-Hans',
  [Locale.Japanese]: 'ja_JP',
  [Locale.Hindi]: 'hi_IN',
} as const;

export const languages = {
  [Locale.English]: 'English',
  [Locale.Vietnamese]: 'Tiếng Việt',
  [Locale.French]: 'Français',
  [Locale.Chinese]: '简体中文',
  [Locale.Japanese]: '日本語',
  [Locale.Hindi]: 'हिन्दी',
} as const;

export type Locales = keyof typeof locales;

export type Languages = keyof typeof Locale;
