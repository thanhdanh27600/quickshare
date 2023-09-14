import { FeatureTabKey } from 'bear/utilitySlice';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPage } from 'pages';
import requestIp from 'request-ip';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';
import { defaultLocale } from 'utils/i18next';

const NoteComponent = ({ feature, ip }: { feature: FeatureTabKey; ip: string }) => {
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
