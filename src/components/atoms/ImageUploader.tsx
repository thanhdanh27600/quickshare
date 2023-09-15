import { UploadCloud } from '@styled-icons/feather';
import { API } from 'api/axios';
import { CldUploadWidget } from 'next-cloudinary';
import { MouseEventHandler, useState } from 'react';
import date from 'utils/date';
import { UploadProvider } from 'utils/media';

export const ImageUploader = ({
  onSuccess,
}: {
  onSuccess: ({ url, mediaId, ogImgPublicId }: { url: string; mediaId: number; ogImgPublicId: string }) => void;
}) => {
  const [resource, setResource] = useState<any>();

  return (
    <div>
      <CldUploadWidget
        options={{
          maxFileSize: 5e6,
          maxImageHeight: 2400,
          croppingAspectRatio: 1200 / 630,
          cropping: true,
          multiple: false,
          showSkipCropButton: false,
          singleUploadAutoClose: true,
          showPoweredBy: false,
          showUploadMoreButton: false,
          maxFiles: 1,
          tags: [date().format('YYYY-MMM'), 'unused'],
        }}
        signatureEndpoint="/api/cld"
        uploadPreset="quickshare"
        onSuccess={async (result, widget) => {
          setResource(result?.info);
          const url = (result?.info as any)?.secure_url;
          const public_id = (result?.info as any)?.public_id;
          const rs = await API.post('/api/i', { url, externalId: public_id, provider: UploadProvider.CLD });
          if (url && rs) {
            onSuccess({ url, ogImgPublicId: public_id, mediaId: rs.data.id });
          }
          widget.close();
        }}>
        {({ open }) => {
          const handleOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
            e.preventDefault();
            open();
          };
          return (
            <button
              className="w-fit cursor-pointer rounded-lg border border-gray-300 p-6 transition-colors hover:bg-gray-100"
              onClick={handleOnClick}>
              <UploadCloud className="h-8 w-8 stroke-[1.25px] text-gray-700" />
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
