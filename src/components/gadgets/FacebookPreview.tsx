import { UrlShortenerHistory } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import { BASE_URL_OG, brandUrlShortDomain } from 'types/constants';

import { encodeBase64 } from 'utils/crypto';
import { useTrans } from 'utils/i18next';

export const FacebookPreview = ({ hash, ogTitle, ogDomain, ogDescription, ogImgSrc }: Partial<UrlShortenerHistory>) => {
  const { t, locale } = useTrans();
  const title = ogTitle || t('ogTitle', { hash: hash || 'XXX' });
  const encodeTitle = encodeBase64(title);

  return (
    <div className="w-fit">
      <div className="ml-auto w-[315px] bg-gray-100/75 sm:w-[420px]">
        <div className="h-[165.375px] w-full border border-solid border-gray-200 bg-cover bg-no-repeat sm:h-[220.5px]">
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
              className="relative origin-top-left scale-[0.2625] sm:scale-[0.35]"
              width={1200}
              height={630}
              src={`${BASE_URL_OG}/api/og?hash=${hash}&title=${encodeTitle}&locale=${locale}&preview=true`}
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
