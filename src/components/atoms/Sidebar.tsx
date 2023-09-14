import { Menu } from '@styled-icons/feather';
import clsx from 'clsx';
import { LanguageSelect } from 'components/gadgets/LanguageSelect';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { BASE_URL, TE } from 'types/constants';
import { linkWithLanguage, useTrans } from 'utils/i18next';

interface Props {
  className?: string;
}

export const Sidebar = ({ className }: Props) => {
  const router = useRouter();
  const { t, locale } = useTrans();
  const sidebarId = 'sideBar';

  const TEInstance = TE();

  useEffect(() => {
    if (TEInstance) {
      TEInstance.Offcanvas.getOrCreateInstance(document.getElementById(sidebarId))?.hide();
    }
  }, [locale]);

  return (
    <>
      <button
        className={clsx(
          'rounded-lg border border-solid border-gray-200 p-2 py-1 outline-cyan-500 transition-colors hover:bg-gray-50 hover:text-cyan-500',
          className,
        )}
        type="button"
        data-te-offcanvas-toggle=""
        data-te-target={`#${sidebarId}`}
        aria-controls={sidebarId}
        data-te-ripple-init=""
        data-te-ripple-color="light">
        <Menu className="w-4" />
      </button>
      <div
        className="invisible fixed bottom-0 right-0 top-0 z-[1045] flex w-72 max-w-full translate-x-full flex-col border-none bg-gray-50 bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out  [&[data-te-offcanvas-show]]:transform-none"
        tabIndex={-1}
        id={sidebarId}
        aria-labelledby="sideBarLabel"
        data-te-offcanvas-init="">
        <div className="flex items-center justify-between p-4">
          <div className="mb-0 font-semibold leading-normal" id="sideBarLabel">
            <Link href="/">
              <Image src={'/assets/quickshare.png'} alt="Quickshare's logo" width={38} height={38} />
            </Link>
          </div>
          <button
            type="button"
            className="box-content rounded-none border-none opacity-50 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
            data-te-offcanvas-dismiss="">
            <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        </div>
        <div className="offcanvas-body flex flex-grow flex-col items-center gap-8 overflow-y-auto p-4">
          {router.pathname !== '/' && (
            <Link href="/" className="text-grey-900 text-xl font-semibold hover:underline">
              {t('urlShortener')}
            </Link>
          )}
          {router.pathname !== '/tracking' && (
            <Link href="/tracking" className="text-grey-900 text-xl font-semibold hover:underline">
              {t('manageLink')}
              {/* <ExternalLink className="mb-4 ml-1 w-4" /> */}
            </Link>
          )}
          {router.pathname !== '/note' && (
            <Link
              href="/note"
              onClick={() => {
                location.href = linkWithLanguage(`${BASE_URL}/note`, locale);
              }}
              className="text-grey-900 text-xl font-semibold hover:underline">
              {t('noteEditor')}
            </Link>
          )}
          <div className="flex w-full flex-1 flex-col items-center justify-end">
            <LanguageSelect />
          </div>
        </div>
      </div>
    </>
  );
};
