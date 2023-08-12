import { URLTracking } from 'components/screens/URLTracking';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { pgFullDomain } from 'utils/guards';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { hash } = context.query;
  try {
    return {
      props: {
        hash: hash ? (hash[0] as string) : '',
        ...(await serverSideTranslations(context.locale ?? 'vi', ['common'])),
      },
    };
  } catch (error: any) {
    console.error('Stats error', error);
    return { props: { error: error.message || 'Something wrong happened' } };
  }
}

export default pgFullDomain(URLTracking);
