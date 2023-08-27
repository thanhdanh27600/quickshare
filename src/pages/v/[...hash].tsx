import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { Locale } from 'types/locale';
import { pgFullDomain } from 'utils/guards';

const URLTracking = dynamic(() => import('../../components/screens/URLTracking').then((mod) => mod.URLTracking));

const Component = (props: any) => <URLTracking hash={props.hash} />;

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
    console.error('Stats error', error);
    return { props: { error: error.message || 'Something wrong happened' } };
  }
}

export default pgFullDomain(Component);
