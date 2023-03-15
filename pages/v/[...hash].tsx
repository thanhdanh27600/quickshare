import { URLTracking } from 'components/screens/URLTracking';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { hash } = context.query;
  try {
    // const stats = await getStats({
    //   hash: hash ? (hash[0] as string) : undefined,
    // });
    // const record = stats.record;
    // const history = stats.history;
    return {
      props: {
        // record: record || null,
        // history: history || null,
        hash: hash ? (hash[0] as string) : '',
        ...(await serverSideTranslations(context.locale ?? 'vi', ['common'])),
      },
    };
  } catch (error: any) {
    console.error('Stats error', error);
    return { props: { error: error.message || 'Something wrong happened' } };
  }
}

export default URLTracking;
