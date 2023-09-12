import { BrandText } from 'components/atoms/BrandIcon';
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
      <div className="flex gap-4">
        {router.pathname !== '/' && (
          <Link href="/" className="h-fit text-cyan-500 underline decoration-1 hover:decoration-wavy">
            {t('urlShortener')}
          </Link>
        )}
        {router.pathname !== '/tracking' && (
          <Link href="/tracking" className="h-fit text-cyan-500 underline decoration-1 hover:decoration-wavy">
            {t('manageLink')}
          </Link>
        )}
      </div>
    </div>
  );
};
