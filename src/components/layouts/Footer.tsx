import { Modal } from 'components/atoms/Modal';
import { LanguageSelect } from 'components/gadgets/LanguageSelect';
import mixpanel from 'mixpanel-browser';
import Image from 'next/image';
import { MIXPANEL_EVENT } from 'types/utils';

export const Footer = () => {
  return (
    <footer className="gap-4 border-y border-gray-200 px-4 py-4 pt-4 sm:py-8">
      <Modal id="donate" title="Donate 🙏" ConfirmButtonProps={{ ['data-te-modal-dismiss']: true } as any}>
        <div className="flex justify-center">
          <Image alt="Qr-Momo" src={'/assets/qr-momo.jpg'} width={180} height={0} />
          <Image alt="Qr-Bank" src={'/assets/qr-bank.jpg'} width={160} height={0} />
        </div>
      </Modal>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div
          data-te-toggle="modal"
          data-te-target="#donate"
          onClick={() => {
            mixpanel.track(MIXPANEL_EVENT.DONATE);
          }}
          className="cursor-pointer text-xs text-gray-500 decoration-1 hover:text-cyan-600 hover:underline hover:decoration-wavy">
          Looks good? Get me a Pho Bo 🍲
        </div>
        <LanguageSelect />
      </div>
    </footer>
  );
};
