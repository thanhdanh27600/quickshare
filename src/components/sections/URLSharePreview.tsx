import { useBearStore } from 'bear';
import { FacebookPreview } from 'components/gadgets/FacebookPreview';
import { TwitterPreview } from 'components/gadgets/TwitterPreview';

export const URLSharePreview = ({ selectedKey }: { selectedKey: string }) => {
  const { shortenSlice } = useBearStore();
  const shortenHistoryForm = shortenSlice((state) => state.shortenHistoryForm);
  if (!shortenHistoryForm) return null;

  return (
    <div className="mx-auto mt-8 flex w-fit flex-col items-center justify-between gap-8 lg:flex-row">
      {selectedKey === 'Facebook' && <FacebookPreview {...shortenHistoryForm} />}
      {selectedKey === 'Twitter' && <TwitterPreview {...shortenHistoryForm} />}
    </div>
  );
};
