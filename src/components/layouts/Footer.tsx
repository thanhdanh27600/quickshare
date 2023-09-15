import { ArrowUpRight } from '@styled-icons/feather';
import { Modal } from 'components/atoms/Modal';
import { LanguageSelect } from 'components/gadgets/LanguageSelect';
import mixpanel from 'mixpanel-browser';
import Image from 'next/image';
import { MIXPANEL_EVENT } from 'types/utils';
import { useTrans } from 'utils/i18next';

export const Footer = () => {
  const { t } = useTrans();
  return (
    <footer className="gap-4 border-y border-gray-200 px-4 py-4 pt-4 sm:py-8">
      <Modal id="donate" title="Donate 🙏" ConfirmButtonProps={{ ['data-te-modal-dismiss']: true } as any}>
        <div className="flex justify-center">
          <Image alt="Qr-Momo" src={'/assets/qr-momo.jpg'} width={180} height={0} />
          <Image alt="Qr-Bank" src={'/assets/qr-bank.jpg'} width={160} height={0} />
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
          </ul>
          <div
            data-te-toggle="modal"
            data-te-target="#donate"
            onClick={() => {
              mixpanel.track(MIXPANEL_EVENT.DONATE);
            }}
            className="mt-2 cursor-pointer text-gray-400 decoration-1 hover:text-cyan-600 hover:underline hover:decoration-wavy">
            Looks good? Get me a Pho Bo 🍲
          </div>
        </div>
        <LanguageSelect />
      </div>
    </footer>
  );
};
