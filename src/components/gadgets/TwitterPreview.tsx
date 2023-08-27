import { BASE_URL, PLATFORM_AUTH, brandUrlShortDomain } from 'types/constants';
import { ShareUrlMeta } from 'types/shorten';
import { encrypt } from 'utils/crypto';
import { useTrans } from 'utils/i18next';

export const TwitterPreview = ({ hash, ogTitle, ogDomain, ogDescription }: ShareUrlMeta) => {
  const { t, locale } = useTrans();
  const title = ogTitle ?? t('ogTitle', { hash: hash || 'XXX' });
  let encodeTitle = '';
  if (PLATFORM_AUTH) {
    encodeTitle = encrypt(title);
  }
  return (
    <div className="w-fit max-[420px]:overflow-scroll">
      <div className="w-[420px]">
        <div
          className="h-[221px] w-full rounded-xl rounded-b-none border border-solid border-gray-200 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${BASE_URL}/api/og?title=${encodeURIComponent(encodeTitle)}&locale=${locale})`,
          }}
        />
        <div className="rounded-xl rounded-t-none border border-t-0 border-solid border-gray-200 py-3 px-2.5">
          <div className="text-left">
            <div className="font-twitter font-bold text-[#18283e]">{title}</div>
          </div>
          <div className="mt-0.5 font-twitter text-sm text-[#18283e]">{ogDescription ?? t('ogDescription')}</div>
          <div className="mt-0.5 border-separate text-ellipsis whitespace-nowrap break-words font-twitter text-sm lowercase text-[#8899a6]">
            {ogDomain ?? brandUrlShortDomain}
          </div>
        </div>
      </div>
    </div>
  );
};
