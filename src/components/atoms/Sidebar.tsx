import { Menu } from '@styled-icons/feather';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTrans } from 'utils/i18next';

interface Props {
  className?: string;
}

export const Sidebar = ({ className }: Props) => {
  const router = useRouter();
  const { t } = useTrans();

  return (
    <>
      <button
        className={clsx(
          'rounded-lg border border-solid border-gray-200 p-4 transition-colors hover:bg-gray-50 hover:text-cyan-500',
          className,
        )}
        type="button"
        data-te-offcanvas-toggle=""
        data-te-target="#offcanvasRight"
        aria-controls="offcanvasRight"
        data-te-ripple-init=""
        data-te-ripple-color="light">
        <Menu className="w-6" />
      </button>
      <div
        className="invisible fixed bottom-0 right-0 top-0 z-[1045] flex w-72 max-w-full translate-x-full flex-col border-none bg-gray-50 bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out  [&[data-te-offcanvas-show]]:transform-none"
        tabIndex={-1}
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
        data-te-offcanvas-init="">
        <div className="flex items-center justify-between p-4">
          <h5 className="mb-0 font-semibold leading-normal" id="offcanvasRightLabel"></h5>
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
            <Link href="/note" className="text-grey-900 text-xl font-semibold hover:underline">
              {t('urlShortener')}
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
