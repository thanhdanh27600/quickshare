import { UrlShortenerHistory } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import { BASE_URL_OG, brandUrlShortDomain } from 'types/constants';
import { encodeBase64 } from 'utils/crypto';
import { useTrans } from 'utils/i18next';

const OgImage = ({ ogImgSrc, hash, encodeTitle }: Partial<UrlShortenerHistory & { encodeTitle: string }>) =>
  ogImgSrc ? (
    <CldImage height={221} width={315} alt={'clickdi-banner'} className="h-full w-full object-contain" src={ogImgSrc} />
  ) : (
    <iframe
      className="relative origin-top-left scale-[0.2625] sm:scale-[0.35]"
      width={1200}
      height={630}
      src={`${BASE_URL_OG}/api/og?hash=${hash}&title=${encodeTitle}&preview=true`}
    />
  );

export const FacebookPreview = ({ hash, ogTitle, ogDomain, ogDescription, ogImgSrc }: Partial<UrlShortenerHistory>) => {
  const { t } = useTrans();
  const title = ogTitle || t('ogTitle', { hash: hash || 'XXX' });
  const encodeTitle = encodeBase64(title);

  return (
    <div className="w-fit">
      <div className="ml-auto w-[315px] bg-gray-100/75 sm:w-[420px]">
        <div className="h-[165.375px] w-full border border-solid border-gray-200 bg-cover bg-no-repeat sm:h-[220.5px]">
          <OgImage encodeTitle={encodeTitle} hash={hash} ogImgSrc={ogImgSrc} />
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

export const TwitterPreview = ({ hash, ogTitle, ogDomain, ogDescription, ogImgSrc }: Partial<UrlShortenerHistory>) => {
  const { t } = useTrans();
  const title = ogTitle || t('ogTitle', { hash: hash || 'XXX' });
  const encodeTitle = encodeBase64(title);

  return (
    <div className="w-fit">
      <div className="ml-auto w-[315px] bg-gray-100/75 sm:w-[420px]">
        <div className="h-[165.375px] w-full rounded-xl rounded-b-none border border-solid border-gray-200 bg-cover bg-no-repeat sm:h-[221px]">
          <OgImage encodeTitle={encodeTitle} hash={hash} ogImgSrc={ogImgSrc} />
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

export const DiscordPreview = ({ hash, ogTitle, ogDomain, ogDescription, ogImgSrc }: Partial<UrlShortenerHistory>) => {
  const { t } = useTrans();
  const title = ogTitle || t('ogTitle', { hash: hash || 'XXX' });
  const encodeTitle = encodeBase64(title);

  return (
    <div className="w-fit">
      <div className="ml-auto w-[315px] rounded-lg bg-[#2B2D31] sm:w-[420px]">
        <div className="p-4 pl-2">
          <div className="border-l-2 border-solid border-l-white pl-4">
            <div className="text-left">
              <div className="font-discord font-bold text-[#00A8FC] line-clamp-2">{title}</div>
            </div>
            <div className="mt-2 font-discord text-sm text-[#dbdee1] line-clamp-2">
              {ogDescription ?? t('ogDescription')}
            </div>
            <div className="mt-4 h-[150px] origin-top-left scale-[0.85] bg-no-repeat sm:h-[205px] sm:w-[421.91] sm:scale-[0.9]">
              <OgImage encodeTitle={encodeTitle} hash={hash} ogImgSrc={ogImgSrc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
