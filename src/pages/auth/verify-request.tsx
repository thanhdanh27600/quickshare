import { Button } from 'components/atoms/Button';
import { LayoutMain } from 'components/layouts/LayoutMain';
import type { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LocaleProp } from 'types/locale';
import { getLanguage, linkWithLanguage, useTrans } from 'utils/i18next';

export default function VerifyRequest(/* {}: InferGetServerSidePropsType<typeof getServerSideProps> */) {
  const { t, locale } = useTrans();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (getLanguage(location.href) !== locale) {
      router.replace(linkWithLanguage(location.href, locale));
    }
  }, []);

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
          <Link href={linkWithLanguage('/', locale)} className="flex-1">
            <Button className="w-full" text={t('home')} />
          </Link>
          <Link href={linkWithLanguage('/contact', locale)}>
            <Button text={t('contact')} className="from-red-500 to-red-400" />
          </Link>
        </div>
      </div>
    </LayoutMain>
  );
}

export async function getServerSideProps({ locale, ...context }: GetServerSidePropsContext & LocaleProp) {
  let toLocale = locale;
  try {
    const headers = context.req.headers;
    const referer = headers.referer ? new URL(headers.referer) : undefined;
    if (referer?.pathname !== '/auth/verify-request' && referer?.href && getLanguage(referer?.href) !== locale) {
      toLocale = getLanguage(referer.href);
    }
  } catch (error) {
    console.error(error);
  }
  return {
    props: { ...(await serverSideTranslations(toLocale, ['common'])) },
  };
}
