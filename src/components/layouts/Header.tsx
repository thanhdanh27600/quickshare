import { BrandText } from 'components/atoms/BrandIcon';
import { Sidebar } from 'components/atoms/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTrans } from 'utils/i18next';

export const Header = () => {
  const { t } = useTrans();
  const router = useRouter();

  return (
    <div className="mx-auto flex items-center justify-between p-4 sm:w-full md:mx-auto md:max-w-7xl">
      <Link href="/">
        <div className="flex w-fit cursor-pointer flex-col items-center gap-2">
          <BrandText width={148} />
        </div>
      </Link>
      <div className="sm:hidden">
        <Sidebar />
      </div>
      <div className="hidden gap-4 sm:flex">
        {router.pathname !== '/' && (
          <Link href="/" className="text-grey-900 h-fit text-lg decoration-1 hover:text-cyan-500 hover:underline">
            {t('urlShortener')}
          </Link>
        )}
        {router.pathname !== '/tracking' && (
          <Link
            href="/tracking"
            className="text-grey-900 h-fit text-lg decoration-1 hover:text-cyan-500 hover:underline">
            {t('manageLink')}
          </Link>
        )}
        {router.pathname !== '/note' && (
          <Link href="/note" className="text-grey-900 h-fit text-lg decoration-1 hover:text-cyan-500 hover:underline">
            {t('noteEditor')}
          </Link>
        )}
      </div>
    </div>
  );
};
