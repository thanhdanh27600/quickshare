import { useBearStore } from 'bear';
import { DiscordPreview, FacebookPreview, TwitterPreview } from 'components/gadgets/OgPreview';

export const URLSharePreview = ({ selectedKey }: { selectedKey: string }) => {
  const { shortenSlice } = useBearStore();
  const shortenHistoryForm = shortenSlice((state) => state.shortenHistoryForm);
  if (!shortenHistoryForm) return null;

  return (
    <div className="mx-auto mt-8 flex w-fit flex-col items-center justify-between gap-8 lg:flex-row">
      {selectedKey === 'Facebook' && <FacebookPreview {...shortenHistoryForm} />}
      {selectedKey === 'Twitter' && <TwitterPreview {...shortenHistoryForm} />}
      {selectedKey === 'Discord' && <DiscordPreview {...shortenHistoryForm} />}
    </div>
  );
};
