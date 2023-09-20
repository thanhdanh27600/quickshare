import { Button } from 'components/atoms/Button';
import { LayoutMain } from 'components/layouts/LayoutMain';
import type { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { defaultLocale, useTrans } from 'utils/i18next';

export default function VerifyRequest(/* {}: InferGetServerSidePropsType<typeof getServerSideProps> */) {
  const { t, locale } = useTrans();
  const router = useRouter();
  const { data: session } = useSession();

  if (!!session) {
    router.replace('/');
    return null;
  }

  return (
    <LayoutMain featureTab={false}>
      <div className="m-auto w-full max-w-lg rounded-lg border border-gray-200 bg-gray-50 p-16 shadow">
        <h1 className="mb-8 text-3xl font-medium">{t('checkSignInEmail')}</h1>
        <p className="mt-4 text-gray-500">{t('checkSignInEmailDetail')}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href={'/'} className="flex-1">
            <Button className="w-full" text={t('home')} />
          </Link>
          <Link href={'/contact'}>
            <Button text={t('contact')} className="from-red-500 to-red-400" />
          </Link>
        </div>
      </div>
    </LayoutMain>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const locale =
    new URL(context.req.cookies['next-auth.callback-url'] as string)?.pathname?.split('/')[1] || defaultLocale;
  return {
    props: { ...(await serverSideTranslations(locale, ['common'])) },
  };
}
