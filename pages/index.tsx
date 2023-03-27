import { LayoutMain } from 'components/layouts/LayoutMain';
import { URLShortener } from 'components/screens/URLShortener';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { brandUrl, isShortDomain, Window } from 'types/constants';
import { LocaleProp } from 'types/locale';

const Home = () => {
  if (isShortDomain) {
    Window()?.location.replace(brandUrl);
  }
  return (
    <LayoutMain>
      <div className="container-xl mx-auto min-h-[80vh] p-4 max-sm:py-8 md:mt-8 md:max-w-5xl">
        <URLShortener />
      </div>
    </LayoutMain>
  );
};

export default Home;

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
  },
});
