import { FeatureTabKey } from 'bear/utilitySlice';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { Home } from 'components/screens/Home';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import requestIp from 'request-ip';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';
import { defaultLocale } from 'utils/i18next';

export const MainPage = ({ feature, ip }: { feature: FeatureTabKey; ip: string }) => {
  return (
    <LayoutMain feature={feature}>
      <Home feature={feature} ip={ip} />
    </LayoutMain>
  );
};
const IndexPage = pgFullDomain(MainPage, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale, req }: GetServerSidePropsContext & LocaleProp) => {
  const ip = requestIp.getClientIp(req);
  return {
    props: {
      feature: FeatureTabKey.SHARE_LINK,
      ip,
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  };
};

export default IndexPage;
