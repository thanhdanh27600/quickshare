import mixpanel from 'mixpanel-browser';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BASE_URL } from 'types/constants';
import { MIXPANEL_EVENT } from 'types/utils';
import { linkWithLanguage, useTrans } from 'utils/i18next';

export const SignInToCustomLink = () => {
  const router = useRouter();
  const { t, locale } = useTrans();
  const { data: session, status } = useSession();

  if (status === 'loading' || !!session) return null;

  const handleSignIn = async () => {
    await signIn('email', { callbackUrl: location.href, redirect: false });
    router.push({
      pathname: linkWithLanguage(`${BASE_URL}/auth/sign-in`, locale),
      query: { callbackUrl: location.href },
    });
    mixpanel.track(MIXPANEL_EVENT.SIGN_IN);
  };

  return (
    <div className="mt-2 text-xs text-gray-500">
      <span>{t('signInToCustomLink')}.</span>{' '}
      <a
        onClick={handleSignIn}
        className="cursor-pointer underline underline-offset-4 transition-colors hover:text-cyan-500">
        {t('signInNow')}
      </a>
    </div>
  );
};
