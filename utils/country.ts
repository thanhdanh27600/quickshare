const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
export const getCountryName = (code: string) => {
  let countryName: string | undefined = '';
  try {
    countryName = regionNames.of(code.toUpperCase());
  } catch (error) {
    console.error('GET COUNTRY ERROR', error);
  }
  return countryName;
};
