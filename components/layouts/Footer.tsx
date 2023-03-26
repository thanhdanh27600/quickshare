import { Modal } from 'components/atoms/Modal';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="gap-4 border-t border-t-gray-200 py-5 px-4">
      <Modal id="donate" title="Donate 🙏" ConfirmButtonProps={{ ['data-te-modal-dismiss']: true } as any}>
        <div className="flex justify-center gap-4">
          <Image alt="Qr-Momo" src={'/assets/qr-momo.jpg'} width={180} height={120} />
          <Image alt="Qr-Bank" src={'/assets/qr-bank.jpg'} width={160} height={160} />
        </div>
      </Modal>
      <div className="mx-auto flex max-w-7xl justify-end gap-4">
        <div
          data-te-toggle="modal"
          data-te-target="#donate"
          className="cursor-pointer text-xs text-gray-500 decoration-1 hover:text-cyan-600 hover:underline hover:decoration-wavy">
          Get me a Pho Bo 🍲
        </div>
      </div>
    </footer>
  );
};
