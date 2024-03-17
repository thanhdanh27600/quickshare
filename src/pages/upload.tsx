import { RedirectShortDomain } from 'components/gadgets/shared/RedirectShortDomain';
import mixpanel from 'mixpanel-browser';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPage } from 'pages';
import { useEffect } from 'react';
import { FeatureTabKey } from 'store/utilitySlice';
import { LocaleProp } from 'types/locale';
import { MIXPANEL_EVENT } from 'types/utils';
import { pgFullDomain } from 'utils/guards';
import { defaultLocale } from 'utils/i18next';

const UploadComponent = ({ feature }: { feature: FeatureTabKey }) => {
  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.UPLOAD_LANDED);
  }, []);
  return <MainPage feature={feature} />;
};

const Upload = pgFullDomain(UploadComponent, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale, req }: GetServerSidePropsContext & LocaleProp) => {
  return {
    props: {
      feature: FeatureTabKey.SHARE_FILE,
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  };
};

export default Upload;
