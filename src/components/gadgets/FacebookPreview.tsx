import { UrlShortenerHistory } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import { BASE_URL, PLATFORM_AUTH, brandUrlShortDomain } from 'types/constants';

import { encrypt } from 'utils/crypto';
import { useTrans } from 'utils/i18next';

export const FacebookPreview = ({ hash, ogTitle, ogDomain, ogDescription, ogImgSrc }: Partial<UrlShortenerHistory>) => {
  const { t, locale } = useTrans();
  const title = ogTitle || t('ogTitle', { hash: hash || 'XXX' });
  let encodeTitle = '';
  if (PLATFORM_AUTH) {
    encodeTitle = encrypt(title);
  }
  return (
    <div className="w-fit">
      <div className="ml-auto w-[315px] bg-gray-100/75 sm:w-[420px]">
        <div className="w-full border border-solid border-gray-200 bg-cover bg-no-repeat sm:h-[220.5px]">
          {ogImgSrc ? (
            <CldImage
              height={221}
              width={315}
              alt={'clickdi-banner'}
              className="h-full w-full object-cover"
              src={ogImgSrc}
            />
          ) : (
            <iframe
              className="relative origin-top-left scale-[0.35]"
              width={1200}
              height={630}
              src={`${BASE_URL}/api/og?hash=${hash}&title=${encodeURIComponent(
                encodeTitle,
              )}&locale=${locale}&preview=true`}
            />
          )}
        </div>
        <div className="border border-t-0 border-solid border-gray-200 py-2 px-2.5">
          <span className="border-separate text-ellipsis whitespace-nowrap break-words font-facebook text-sm uppercase text-[#606770]">
            {ogDomain ?? brandUrlShortDomain}
          </span>
          <div className="text-left">
            <div className="font-facebook text-[16px] font-semibold text-[#1d2129] line-clamp-2">{title}</div>
          </div>
          <span className="mt-0.5 font-facebook text-sm text-[#606770] line-clamp-2">
            {ogDescription ?? t('ogDescription')}
          </span>
        </div>
      </div>
    </div>
  );
};
