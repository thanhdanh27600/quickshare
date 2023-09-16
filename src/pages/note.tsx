import { FeatureTabKey } from 'bear/utilitySlice';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { logEvent } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPage } from 'pages';
import { useEffect } from 'react';
import requestIp from 'request-ip';
import { LocaleProp } from 'types/locale';
import { FIREBASE_ANALYTICS_EVENT, MIXPANEL_EVENT } from 'types/utils';
import { analytics } from 'utils/firebase';
import { pgFullDomain } from 'utils/guards';
import { defaultLocale } from 'utils/i18next';

const NoteComponent = ({ feature, ip }: { feature: FeatureTabKey; ip: string }) => {
  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.NOTE_LANDED);
    logEvent(analytics, FIREBASE_ANALYTICS_EVENT.NOTE_LANDED);
  }, []);

  return <MainPage feature={feature} ip={ip} />;
};

const Note = pgFullDomain(NoteComponent, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale, req }: GetServerSidePropsContext & LocaleProp) => {
  const ip = requestIp.getClientIp(req);
  return {
    props: {
      feature: FeatureTabKey.SHARE_TEXT,
      ip,
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  };
};

export default Note;
