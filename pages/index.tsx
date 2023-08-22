import { LayoutMain } from 'components/layouts/LayoutMain';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
// import { URLShortener } from 'components/screens/URLShortener';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';

const URLShortener = dynamic(() => import('../components/screens/URLShortener').then((mod) => mod.URLShortener));

const MainPage = () => {
  return (
    <LayoutMain>
      <div className="container-xl mx-auto min-h-[80vh] p-4 max-sm:py-8 md:mt-8 md:max-w-5xl">
        <URLShortener />
      </div>
    </LayoutMain>
  );
};
const Home = pgFullDomain(MainPage, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
  },
});

export default Home;
