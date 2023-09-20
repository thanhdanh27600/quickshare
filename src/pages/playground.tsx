import { LayoutMain } from 'components/layouts/LayoutMain';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { defaultLocale } from 'utils/i18next';

const PlaygroundComponent = dynamic(() => import('../components/screens/Playground').then((mod) => mod.Playground), {
  ssr: false,
});

const Playground = () => {
  return (
    <LayoutMain featureTab={false}>
      <PlaygroundComponent />
    </LayoutMain>
  );
};

export default Playground;

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  };
};
