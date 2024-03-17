import { User } from '@styled-icons/feather';
import { BrandText } from 'components/atoms/BrandIcon';
import { Sidebar } from 'components/atoms/Sidebar';
import mixpanel from 'mixpanel-browser';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MIXPANEL_EVENT } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { truncateMiddle } from 'utils/text';

export const Header = () => {
  const { t, locale } = useTrans();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    mixpanel.track(MIXPANEL_EVENT.SIGN_OUT);
  };

  return (
    <div className="p-4 sm:w-full md:mx-auto md:max-w-7xl">
      <div className="mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex w-fit cursor-pointer flex-col items-center gap-2">
            <BrandText width={148} />
          </div>
        </Link>
        {locale && (
          <>
            <div className="sm:hidden">
              <Sidebar />
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              {router.pathname !== '/' && (
                <Link
                  href="/"
                  className="text-grey-900 text-md h-fit font-medium decoration-1 hover:text-cyan-500 hover:underline">
                  {t('urlShortener')}
                </Link>
              )}
              {router.pathname !== '/tracking' && (
                <Link
                  href="/tracking"
                  className="text-grey-900 text-md h-fit font-medium decoration-1 hover:text-cyan-500 hover:underline">
                  {t('manageLink')}
                </Link>
              )}
              {router.pathname !== '/note' && (
                <Link
                  href="/note"
                  className="text-grey-900 text-md h-fit font-medium decoration-1 hover:text-cyan-500 hover:underline">
                  {t('noteEditor')}
                </Link>
              )}
              {router.pathname !== '/upload' && (
                <Link
                  href="/upload"
                  className="text-grey-900 text-md h-fit font-medium decoration-1 hover:text-cyan-500 hover:underline">
                  {t('uploadFile')}
                </Link>
              )}
            </div>
          </>
        )}
      </div>
      {locale && session?.user?.email && (
        <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
          <User className="w-4" />
          <span className="max-sm:hidden">{truncateMiddle(session.user.email, 30, 15)}</span>
          <span className="sm:hidden">{truncateMiddle(session.user.email, 15, 10)}</span>
          <a
            onClick={handleSignOut}
            className="cursor-pointer underline underline-offset-4 transition-colors hover:text-cyan-500">
            {t('signOut')}
          </a>
        </div>
      )}
    </div>
  );
};
