import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import requestIp from 'request-ip';
import { getFileRequest } from 'requests';
import { FileWithData } from 'types/file';
import { defaultLocale } from 'utils/i18next';
import PageNotFound from '../404';

interface Props {
  file: FileWithData;
  error?: unknown;
  ip: string;
}

const RawFile = ({ file, ip, error }: Props) => {
  if (!file || !file.Media || !!error) return <PageNotFound />;
  // This component triggers server-side redirect in getServerSideProps
  return null;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const locale = context.locale || defaultLocale;
    const { hash } = context.query;
    const ip = requestIp.getClientIp(context.req) || '';
    // start server-side get note
    const fileRs = await getFileRequest(hash ? (hash[0] as string) : '');

    if (!fileRs.file || !fileRs.file.Media || !fileRs.file.Media.name) throw new Error('Cannot found file');

    // Redirect to download API
    return {
      redirect: {
        destination: `/api/download?fileName=${encodeURIComponent(fileRs.file.Media.name)}`,
        permanent: false,
      },
    };
  } catch (error: any) {
    return {
      props: { error: error.message || 'somethingWrong', ...(await serverSideTranslations(defaultLocale, ['common'])) },
    };
  }
}

export default RawFile;
