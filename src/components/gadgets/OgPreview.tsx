import { UrlShortenerHistory } from '@prisma/client';
import clsx from 'clsx';
import { CldImage } from 'next-cloudinary';
import { BASE_URL_OG, brandUrlShortDomain } from 'types/constants';
import { encodeBase64 } from 'utils/crypto';
import { useTrans } from 'utils/i18next';

const OgImage = ({
  ogImgSrc,
  hash,
  encodeTitle,
  className,
}: Partial<UrlShortenerHistory & { encodeTitle: string; className?: string }>) =>
  ogImgSrc ? (
    <CldImage
      height={221}
      width={315}
      alt={'clickdi-banner'}
      className={clsx('h-full w-full object-contain', className)}
      src={ogImgSrc}
    />
  ) : (
    <iframe
      className={clsx('relative origin-top-left scale-[0.2485] sm:scale-[0.349]', className)}
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
      <div className="ml-auto w-[300px] bg-gray-100/75 sm:w-[420px]">
        <div className="h-[157.5px] w-full border border-solid border-gray-200 bg-cover bg-no-repeat sm:h-[220.5px]">
          <OgImage encodeTitle={encodeTitle} hash={hash} ogImgSrc={ogImgSrc} />
        </div>
        <div className="border border-t-0 border-solid border-gray-200 px-2.5 py-2">
          <span className="border-separate text-ellipsis whitespace-nowrap break-words font-facebook text-sm uppercase text-[#606770]">
            {ogDomain ?? brandUrlShortDomain}
          </span>
          <div className="text-left">
            <div className="line-clamp-2 font-facebook text-[16px] font-semibold text-[#1d2129]">{title}</div>
          </div>
          <span className="mt-0.5 line-clamp-2 font-facebook text-sm text-[#606770]">
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
      <div className="ml-auto w-[300px] rounded-[1.5rem] bg-gray-100/75 sm:w-[420px]">
        <div className="h-[157.5px] w-full rounded-[1.5rem] rounded-b-none border border-solid border-gray-200 bg-cover bg-no-repeat sm:h-[221px]">
          <OgImage
            encodeTitle={encodeTitle}
            hash={hash}
            ogImgSrc={ogImgSrc}
            className="rounded-t-[5.75rem] sm:rounded-t-[4.25rem]"
          />
        </div>
        <div className="rounded-[1.5rem] rounded-t-none border border-t-0 border-solid border-gray-200 px-2.5 py-3">
          <div className="text-left">
            <div className="line-clamp-2 font-twitter font-bold text-[#18283e]">{title}</div>
          </div>
          <div className="mt-0.5 line-clamp-2 font-twitter text-sm text-[#18283e]">
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
      <div className="ml-auto w-[300px] rounded-2xl bg-[#2B2D31] sm:w-[420px]">
        <div className="p-4 pl-2">
          <div className="border-l-2 border-solid border-l-white pl-4">
            <div className="text-left">
              <div className="line-clamp-2 font-discord font-bold text-[#00A8FC]">{title}</div>
            </div>
            <div className="mt-2 line-clamp-2 font-discord text-sm text-[#dbdee1]">
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
