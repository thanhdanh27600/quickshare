import { UrlShortenerHistory } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import { BASE_URL, PLATFORM_AUTH, brandUrlShortDomain } from 'types/constants';
import { encrypt } from 'utils/crypto';
import { useTrans } from 'utils/i18next';

export const TwitterPreview = ({ hash, ogTitle, ogDomain, ogDescription, ogImgSrc }: Partial<UrlShortenerHistory>) => {
  const { t, locale } = useTrans();
  const title = ogTitle || t('ogTitle', { hash: hash || 'XXX' });
  let encodeTitle = '';
  if (PLATFORM_AUTH) {
    encodeTitle = encrypt(title);
  }
  return (
    <div className="w-fit">
      <div className="ml-auto w-[315px] bg-gray-100/75 sm:w-[420px]">
        <div className="h-[165.375px] w-full rounded-xl rounded-b-none border border-solid border-gray-200 bg-cover bg-no-repeat sm:h-[221px]">
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
              src={`${BASE_URL}/api/og?hash=${hash}&title=${encodeURIComponent(
                encodeTitle,
              )}&locale=${locale}&preview=true`}
            />
          )}
        </div>
        <div className="rounded-xl rounded-t-none border border-t-0 border-solid border-gray-200 py-3 px-2.5">
          <div className="text-left">
            <div className="font-twitter font-bold text-[#18283e] line-clamp-2">{title}</div>
          </div>
          <div className="mt-0.5 font-twitter text-sm text-[#18283e] line-clamp-2">
            {ogDescription ?? t('ogDescription')}
          </div>
          <div className="mt-0.5 border-separate text-ellipsis whitespace-nowrap break-words font-twitter text-sm lowercase text-[#8899a6]">
            {ogDomain ?? brandUrlShortDomain}
          </div>
        </div>
      </div>
    </div>
  );
};
