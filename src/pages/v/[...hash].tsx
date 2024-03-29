import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import PageNotFound from 'pages/404';
import { Locale } from 'types/locale';
import { pgFullDomain } from 'utils/guards';

const URLTracking = dynamic(() => import('../../components/screens/URLTracking').then((c) => c.URLTracking), {
  ssr: false,
});
const Component = (props: any) => (props.errors ? <PageNotFound /> : <URLTracking hash={props.hash} />);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { hash } = context.query;
  try {
    return {
      props: {
        hash: hash ? (hash[0] as string) : '',
        ...(await serverSideTranslations(context.locale ?? Locale.Vietnamese, ['common'])),
      },
    };
  } catch (error: any) {
    return { props: { error: error.message || 'Something wrong happened' } };
  }
}

export default pgFullDomain(Component);
