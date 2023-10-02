import { DiscordPreview, FacebookPreview, TwitterPreview } from 'components/gadgets/URLPreview/OgPreview';
import { ThemeSelector } from 'components/gadgets/URLPreview/ThemeSelector';
import { useBearStore } from 'store';

export const URLSharePreview = ({ selectedKey }: { selectedKey: string }) => {
  const { shortenSlice } = useBearStore();
  const shortenHistory = shortenSlice((state) => state.shortenHistory);
  if (!shortenHistory) return <div className="min-h-[300px] sm:min-h-[340px]"></div>;

  return (
    <div className="mx-auto mt-8 flex w-fit flex-col items-center justify-between gap-8 ">
      {!shortenHistory.ogImgSrc && <ThemeSelector />}
      {selectedKey === 'Facebook' && <FacebookPreview {...shortenHistory} />}
      {selectedKey === 'Twitter' && <TwitterPreview {...shortenHistory} />}
      {selectedKey === 'Discord' && <DiscordPreview {...shortenHistory} />}
    </div>
  );
};
