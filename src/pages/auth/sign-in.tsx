import { Button } from 'components/atoms/Button';
import { Input } from 'components/atoms/Input';
import { LayoutMain } from 'components/layouts/LayoutMain';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { defaultLocale, useTrans } from 'utils/i18next';

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t, locale } = useTrans();

  return (
    <LayoutMain featureTab={false}>
      <div className="m-auto mt-8 w-full max-w-xl rounded-lg border border-gray-200 bg-gray-50 p-16 shadow">
        <h1 className="mb-4 text-2xl font-medium sm:mb-8 sm:text-3xl">{t('signInNow')}</h1>
        <form method="post" action="/api/auth/signin/email">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input name="locale" type="hidden" defaultValue={locale} />
          <label className="text-lg sm:text-xl">
            Email
            <Input className="mt-2" type="email" id="email" name="email" />
          </label>
          <p className="mt-4 text-gray-500">{t('signInNowDetail')}</p>
          <Button className="mt-1 w-full" type="submit">
            {t('go')}
          </Button>
        </form>
      </div>
    </LayoutMain>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const locale = new URL(context.query.callbackUrl as string)?.pathname?.split('/')[1] || defaultLocale;
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken, ...(await serverSideTranslations(locale, ['common'])) },
  };
}
