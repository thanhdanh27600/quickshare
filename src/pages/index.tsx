import { FeatureTabKey } from 'bear/utilitySlice';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { Home } from 'components/screens/Home';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';
import { defaultLocale } from 'utils/i18next';

export const MainPage = ({ feature }: { feature: FeatureTabKey }) => {
  return (
    <LayoutMain>
      <Home feature={feature} />
    </LayoutMain>
  );
};
const IndexPage = pgFullDomain(MainPage, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    feature: FeatureTabKey.SHARE_LINK,
    ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
  },
});

export default IndexPage;
