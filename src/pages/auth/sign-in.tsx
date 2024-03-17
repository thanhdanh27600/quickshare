import { ErrorMessage } from '@hookform/error-message';
import { Button } from 'components/atoms/Button';
import { Input } from 'components/atoms/Input';
import { LayoutMain } from 'components/layouts/LayoutMain';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken, useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LocaleProp } from 'types/locale';
import { defaultLocale, useTrans } from 'utils/i18next';
import { emailRegex } from 'utils/text';

type SigninForm = {
  email: string;
};

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t, locale } = useTrans();
  const router = useRouter();
  const submitBtn = useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>();

  if (status === 'loading') return null;

  if (!!session) {
    router.replace('/');
    return null;
  }

  const onSubmit: SubmitHandler<SigninForm> = (values) => {
    submitBtn.current?.click();
  };

  return (
    <LayoutMain featureTab={false}>
      <div className="m-auto mt-8 w-full max-w-xl rounded-lg border border-gray-200 bg-gray-50 p-16 shadow">
        <h1 className="mb-4 text-2xl font-medium sm:mb-8 sm:text-3xl">{t('signInNow')}</h1>
        <form method="post" action="/api/auth/signin/email" onSubmitCapture={() => setLoading(true)}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input name="locale" type="hidden" defaultValue={locale} />
          <label className="text-lg sm:text-xl">
            Email
            <Input
              className="mt-2"
              id="email"
              {...register('email', {
                validate: (value) => {
                  if (!value || !value.trim().length || !emailRegex.test(value)) return t('errorInvalidEmail');
                },
              })}
            />
          </label>
          <ErrorMessage
            errors={errors}
            name="email"
            render={(error) => <p className="text-red-400">{error.message}</p>}
          />
          <p className="mt-2 text-sm text-gray-500">{t('signInNowDetail')}</p>
          <Button className="mt-4 w-full" type="button" loading={loading} onClick={handleSubmit(onSubmit)}>
            {t('continue')}
          </Button>
          <button type="submit" className="hidden" ref={submitBtn} />
        </form>
      </div>
    </LayoutMain>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext & LocaleProp) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken, ...(await serverSideTranslations(context.locale ?? defaultLocale, ['common'])) },
  };
}
