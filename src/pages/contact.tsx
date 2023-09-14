import { Modal } from 'components/atoms/Modal';
import { LayoutMain } from 'components/layouts/LayoutMain';
import mixpanel from 'mixpanel-browser';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { LocaleProp } from 'types/locale';
import { MIXPANEL_EVENT } from 'types/utils';
import { defaultLocale } from 'utils/i18next';

const Contact = () => {
  return (
    <LayoutMain featureTab={false}>
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
          className="cursor-pointer text-xs text-gray-500 decoration-1 hover:text-cyan-600 hover:underline">
          Look goods? Get me a Pho Bo 🍲
        </div>
      </div>
    </LayoutMain>
  );
};

export const getServerSideProps = async ({ locale }: LocaleProp) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  };
};

export default Contact;
