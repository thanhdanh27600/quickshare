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
  const [timeoutButton, setTimeoutButton] = useState(0);
  const { shortenSlice, utilitySlice } = useBearStore();

  const [shortenHistory] = shortenSlice((state) => [state.shortenHistory]);
  const [country] = utilitySlice((state) => [state.country]);

  const reportLink = useFeedbackTemplate(FeedbackTemplate.REPORT_LINK);

  useEffect(() => {
    if (!shortenHistory) return;
    if (isLocal) return;
    const timeout = setTimeout(() => {
      setOpen(true);
      setTimeoutButton(6);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [shortenHistory]);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setTimeoutButton((state) => {
        if (state === 0) clearInterval(interval);
        return state === 0 ? 0 : state - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [open]);

  if (!locale) return null;

  return (
    <footer className={clsx('gap-4 border-y border-gray-200 px-4 py-4 pt-4 sm:py-8', className)}>
      <Modal
        id="donate"
        title="Donate 🙏"
        confirmText={`No, I'm sorry :( ${timeoutButton > 0 ? timeoutButton : ''}`}
        hideDismissButton
        ConfirmButtonProps={{ ['data-te-modal-dismiss']: true, disabled: timeoutButton > 0 } as any}
        open={open}
        blockDismiss>
        <p className="text-center text-red-500">{t('donateDetail')}</p>
        {country === 'VN' && (
          <>
            <div className="mt-2 flex justify-center">
              <Image alt="Qr-Bank" src={'/assets/qr-bank.jpg'} width={200} height={0} />
            </div>
            <p className="my-4 text-center text-xl font-bold">{`or`}</p>
          </>
        )}
        <div className="mt-2 flex justify-center gap-2">
          <a
            target="_blank"
            href="https://wise.com/pay/r/WERUX911k7Un7LM"
            className="inline-flex items-center font-medium hover:text-cyan-600 hover:underline">
            <Image className="mr-2" alt="Wise-Bank" src={'/assets/wise-bank.png'} width={120} height={0} /> {`Wise`}
            <ArrowUpRight className="mb-2 w-4" />
          </a>
        </div>
        <p className="my-4 text-center text-xl font-bold">{`or`}</p>
        <div className="mt-2 flex justify-center">
          <a
            target="_blank"
            href="https://paypal.me/dolph2k"
            className="inline-flex items-center font-medium hover:text-cyan-600 hover:underline">
            <Image className="mr-2" alt="Qr-Paypal" src={'/assets/paypal.png'} width={50} height={0} />
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
