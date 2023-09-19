import { FeatureTabKey } from 'bear/utilitySlice';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { URLStats } from 'components/sections/URLStatsInput';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';
import { defaultLocale } from 'utils/i18next';

const TrackingComponent = () => {
  return (
    <LayoutMain featureTab={false}>
      <Head>
        <title>Find your shortened link in Quickshare</title>
        <meta name="title" content={`Find your shortened link in Quickshare`} />
        <meta name="description" content={`Input your shortened URL to find and live tracking`} />
      </Head>
      <URLStats defaultOpen />
    </LayoutMain>
  );
};
const Tracking = pgFullDomain(TrackingComponent, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    feature: FeatureTabKey.SHARE_TEXT,
    ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
  },
});

export default Tracking;
