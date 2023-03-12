import { getStats } from 'api/requests';
import { URLTracking } from 'components/screens/URLTracking';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { hash } = context.query;
  try {
    const stats = await getStats({
      hash: hash ? (hash[0] as string) : undefined,
    });
    const record = stats.record;
    const history = stats.history;
    return { props: { record, history, hash: hash ? (hash[0] as string) : '' } };
  } catch (error: any) {
    console.error('Stats error', error);
    return { props: { error: error.message || 'Something wrong happened' } };
  }
}

export default URLTracking;
