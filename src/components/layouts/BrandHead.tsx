import Head from 'next/head';
import { BASE_URL, isProduction, isShortDomain } from 'types/constants';
import { useTrans } from 'utils/i18next';

export const BrandHead = () => {
  const { t, locale } = useTrans();
  if (isShortDomain) {
    return null;
  }
  return (
    <Head>
      {/* Primary Meta Tags */}
      <meta name="title" content={t('brandTitle')} />
      <meta name="description" content={t('brandDescription')} />

      {isProduction && <title>{t('brandTitle')}</title>}
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://facebook.com/clickditop/" />
      <meta property="og:title" content={t('brandTitle')} />
      <meta property="og:description" content={t('brandDescription')} />
      <meta property="og:image" content={`${BASE_URL}/assets/clickdi-banner-${locale}.jpeg`} />
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://twitter.com/clickditop" />
      <meta property="twitter:title" content={t('brandTitle')} />
      <meta property="twitter:description" content={t('brandDescription')} />
      <meta property="og:image" content={`${BASE_URL}/assets/clickdi-banner-${locale}.jpeg`} />
    </Head>
  );
};
