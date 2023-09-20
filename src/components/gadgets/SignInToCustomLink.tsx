import mixpanel from 'mixpanel-browser';
import { signIn, useSession } from 'next-auth/react';
import { MIXPANEL_EVENT } from 'types/utils';
import { useTrans } from 'utils/i18next';

export const SignInToCustomLink = () => {
  const { t } = useTrans();
  const { data: session } = useSession();

  if (!!session) return null;

  const handleSignIn = () => {
    signIn();
    mixpanel.track(MIXPANEL_EVENT.SIGN_IN);
  };

  return (
    <div className="text-xs text-gray-500">
      <span>{t('signInToCustomLink')}.</span>{' '}
      <a
        onClick={handleSignIn}
        className="cursor-pointer underline underline-offset-4 transition-colors hover:text-cyan-500">
        {t('signInNow')}
      </a>
    </div>
  );
};
