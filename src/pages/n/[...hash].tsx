import { Note } from '@prisma/client';
import { getNoteRequest } from 'api/requests';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import requestIp from 'request-ip';
import { defaultLocale, useTrans } from 'utils/i18next';
import PageNotFound from '../404';

interface Props {
  note: Note;
  error?: unknown;
  ip: string;
}

const TextEditor = dynamic(() => import('../../components/gadgets/TextEditor').then((c) => c.default), { ssr: false });

const ViewNote = ({ note, ip, error }: Props) => {
  const { t, locale } = useTrans();
  if (!note || !note.text || !!error) return <PageNotFound />;

  return (
    <>
      {/* CUSTOM HEAD */}
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://facebook.com/clickditop/ " />
        <meta property="og:title" content={t('ogTitle', { hash: note.hash })} />
        <meta property="og:description" content={t('ogDescription')} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:url" content="https://twitter.com/clickditop" /> */}
        <meta property="twitter:title" content={t('ogTitle', { hash: note.hash })} />
        <meta property="twitter:description" content={t('ogDescription')} />
      </Head>
      <LayoutMain featureTab={false}>
        <TextEditor defaultValue={note.text} readonly />
      </LayoutMain>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const locale = context.locale || defaultLocale;
    const { hash } = context.query;
    const ip = requestIp.getClientIp(context.req) || '';
    // start server-side get note
    const noteRs = await getNoteRequest(hash ? (hash[0] as string) : '');

    if (!noteRs.note) throw new Error('Cannot found note');

    return {
      props: {
        note: noteRs.note,
        ip,
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  } catch (error: any) {
    console.error('ViewNote error', error);
    return {
      props: { error: error.message || 'somethingWrong', ...(await serverSideTranslations(defaultLocale, ['common'])) },
    };
  }
}

export default ViewNote;
