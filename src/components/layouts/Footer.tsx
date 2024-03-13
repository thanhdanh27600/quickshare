import { ArrowUpRight } from '@styled-icons/feather';
import clsx from 'clsx';
import { Modal } from 'components/atoms/Modal';
import { LanguageSelect } from 'components/gadgets/shared/LanguageSelect';
import { FeedbackTemplate, useFeedbackTemplate } from 'components/sections/FeedbackLink';
import mixpanel from 'mixpanel-browser';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useBearStore } from 'store';
import { isLocal } from 'types/constants';
import { MIXPANEL_EVENT } from 'types/utils';
import { useTrans } from 'utils/i18next';

export const Footer = ({ className }: { className?: string }) => {
  const { t, locale } = useTrans();
  const [open, setOpen] = useState(false);
  const { shortenSlice } = useBearStore();

  const [shortenHistory] = shortenSlice((state) => [state.shortenHistory]);

  const reportLink = useFeedbackTemplate(FeedbackTemplate.REPORT_LINK);

  useEffect(() => {
    if (!shortenHistory) return;
    if (isLocal) return;
    const timeout = setTimeout(() => {
      setOpen(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [shortenHistory]);

  if (!locale) return null;

  return (
    <footer className={clsx('gap-4 border-y border-gray-200 px-4 py-4 pt-4 sm:py-8', className)}>
      <Modal
        id="donate"
        title="Donate 🙏"
        confirmText={"No, I'm sorry :("}
        hideDismissButton
        ConfirmButtonProps={{ ['data-te-modal-dismiss']: true } as any}
        open={open}
        blockDismiss>
        <p className="text-center text-sm">Duy trì server 10k/ngày, ai đó gánh chung không 🙏🙏🙏</p>
        <div className="flex justify-center">
          <Image alt="Qr-Bank" src={'/assets/qr-bank.jpg'} width={200} height={0} />
        </div>
        <p className="my-4 text-center text-xl font-bold">{`or`}</p>
        <div className="mt-2 flex justify-center">
          <a
            target="_blank"
            href="https://paypal.me/dolph2k"
            className="inline-flex items-center font-medium hover:text-cyan-600 hover:underline">
            <Image alt="Qr-Momo" src={'/assets/paypal.png'} width={50} height={0} />
            {`Paypal`}
            <ArrowUpRight className="mb-2 w-4" />
          </a>
        </div>
      </Modal>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm">
        <div>
          <ul className="max-w-md list-inside list-disc space-y-1 text-gray-500">
            <li>
              <a
                target="_blank"
                href="/contact"
                className="inline-flex items-center font-medium hover:text-cyan-600 hover:underline">
                {t('contact')}
                <ArrowUpRight className="mb-2 w-4" />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="/terms-of-service"
                className="inline-flex items-center font-medium hover:text-cyan-600 hover:underline">
                {t('tos')}
                <ArrowUpRight className="mb-2 w-4" />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="/privacy-policy"
                className="inline-flex items-center font-medium hover:text-cyan-600 hover:underline">
                {t('pp')}
                <ArrowUpRight className="mb-2 w-4" />
              </a>
            </li>

            <li>
              <a
                target="_blank"
                href={reportLink}
                className="inline-flex items-center font-medium hover:text-cyan-600 hover:underline">
                {t('reportLink')}
                <ArrowUpRight className="mb-2 w-4" />
              </a>
            </li>
          </ul>
          <div
            data-te-toggle="modal"
            data-te-target="#donate"
            onClick={() => {
              mixpanel.track(MIXPANEL_EVENT.DONATE);
            }}
            className="mt-2 cursor-pointer text-gray-400 decoration-1 hover:text-cyan-600 hover:underline hover:decoration-wavy">
            {'Looks good? Get me a Pho Bo 🍲'}
          </div>
        </div>
        <LanguageSelect />
      </div>
    </footer>
  );
};
