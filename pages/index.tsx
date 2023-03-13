import { Header } from 'components/layouts/Header';
import { URLShortener } from 'components/screens/URLShortener';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LocaleProp } from 'types/locale';

const Home = () => {
  return (
    <>
      <Header />
      <div className="container p-4 md:mx-auto md:mt-8 md:max-w-5xl">
        <URLShortener />
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
  },
});
