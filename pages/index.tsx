import { LayoutMain } from 'components/layouts/LayoutMain';
import { URLShortener } from 'components/screens/URLShortener';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isShortDomain } from 'types/constants';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';

const Home = () => {
  console.log('isShortDomain', isShortDomain);
  return (
    <LayoutMain>
      <div className="container-xl mx-auto min-h-[80vh] p-4 max-sm:py-8 md:mt-8 md:max-w-5xl">
        <URLShortener />
      </div>
    </LayoutMain>
  );
};

export default pgFullDomain(Home);

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
  },
});
