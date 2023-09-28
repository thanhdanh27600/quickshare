import { Facebook, Share2, Twitter } from '@styled-icons/feather';
import axios from 'axios';
import { Button } from 'components/atoms/Button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useBearStore } from 'store';
import { BASE_URL_SHORT } from 'types/constants';
import { useTrans } from 'utils/i18next';
import { share } from 'utils/text';

export const URLShare = () => {
  const { t, locale } = useTrans('common');
  const [qr, setQr] = useState('');
  const { shortenSlice } = useBearStore();
  const [shortenUrl, getHash] = shortenSlice((state) => [state.getShortenUrl(), state.getHash]);

  const onShare = () => {
    share(
      {
        title: t('ogTitle', { hash: getHash() }),
        text: t('ogDescription'),
        url: shortenUrl,
      },
      t,
    );
  };

  useEffect(() => {
    axios.get(`/api/qr?text=${shortenUrl}`).then(({ data }) => setQr(data));
  }, [shortenUrl]);

  return (
    <div className="mt-4 flex justify-center sm:justify-end">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          text={<Share2 className="h-6 w-6 fill-white" />}
          className="h-fit !bg-gray-400 !bg-none hover:!bg-gray-400/80"
          TextClassname="!text-sm !p-0"
          onClick={onShare}
        />
        <a href={`http://www.facebook.com/sharer.php?u=${shortenUrl}`} target="_blank">
          <Button
            text={<Facebook className="h-6 w-6 fill-white" />}
            className="h-fit !bg-[#3b5998] !bg-none hover:!bg-[#4c70ba]"
            TextClassname="!text-sm !p-0"
          />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${t('ogTitle', { hash: getHash() })}&url=${shortenUrl}`}
          target="_blank">
          <Button
            text={<Twitter className="h-6 w-6 fill-white" />}
            className="h-fit !bg-[#409dd5] !bg-none hover:!bg-[#6ab2de]"
            TextClassname="!text-sm !p-0"
          />
        </a>

        {qr && (
          <a
            href={qr}
            download={`QR-${shortenUrl.replace(`${BASE_URL_SHORT}/`, '')}`}
            className="flex flex-col items-center gap-2">
            <div className="border border-cyan-500 p-1">
              <Image src={qr} alt="QR-Code" width={84} height={84} />
            </div>
            <Button
              text={t('downloadQR')}
              TextClassname="!text-sm !p-0 text-gray-900"
              className="!bg-gray-200 !bg-none hover:!bg-gray-300"
            />
          </a>
        )}
      </div>
    </div>
  );
};
