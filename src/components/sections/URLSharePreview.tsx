import { FacebookPreview } from 'components/gadgets/FacebookPreview';
import { TwitterPreview } from 'components/gadgets/TwitterPreview';
import { ShareUrlMeta } from 'types/shorten';

export const URLSharePreview = (props: ShareUrlMeta) => {
  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-8 lg:flex-row">
      <div>
        <p className="mb-2 text-gray-500">{`Facebook`}</p>
        <FacebookPreview {...props} />
      </div>
      <div>
        <p className="mb-2 text-gray-500">{`Twitter`}</p>
        <TwitterPreview {...props} />
      </div>
    </div>
  );
};
