import { useBearStore } from 'bear';
import { FacebookPreview } from 'components/gadgets/FacebookPreview';
import { TwitterPreview } from 'components/gadgets/TwitterPreview';

export const URLSharePreview = () => {
  const { shortenSlice } = useBearStore();
  const shortenHistoryForm = shortenSlice((state) => state.shortenHistoryForm);
  if (!shortenHistoryForm) return null;

  return (
    <div className="mx-auto mt-4 flex w-fit flex-col items-center justify-between gap-8 lg:flex-row">
      <div>
        <p className="mb-2 text-gray-500">{`Facebook`}</p>
        <FacebookPreview {...shortenHistoryForm} />
      </div>
      <div>
        <p className="mb-2 text-gray-500">{`Twitter`}</p>
        <TwitterPreview {...shortenHistoryForm} />
      </div>
    </div>
  );
};
