import { useBearStore } from 'bear';
import { DiscordPreview, FacebookPreview, TwitterPreview } from 'components/gadgets/OgPreview';

export const URLSharePreview = ({ selectedKey }: { selectedKey: string }) => {
  const { shortenSlice } = useBearStore();
  const shortenHistoryForm = shortenSlice((state) => state.shortenHistoryForm);
  if (!shortenHistoryForm) return <div className="min-h-[300px] sm:min-h-[340px]"></div>;

  return (
    <div className="mx-auto mt-8 flex w-fit flex-col items-center justify-between gap-8 ">
      {selectedKey === 'Facebook' && <FacebookPreview {...shortenHistoryForm} />}
      {selectedKey === 'Twitter' && <TwitterPreview {...shortenHistoryForm} />}
      {selectedKey === 'Discord' && <DiscordPreview {...shortenHistoryForm} />}
    </div>
  );
};
