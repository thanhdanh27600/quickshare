import { Locale } from 'types/locale';

export const getCountryName = (code: string, locale: Locale = Locale.English) => {
  const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
  let countryName: string | undefined = '';
  try {
    countryName = regionNames.of(code.toUpperCase());
  } catch (error) {
    console.error('GET COUNTRY NAME ERROR', error);
    return '';
  }
  return countryName;
};
