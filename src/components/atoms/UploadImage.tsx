import { UploadCloud } from '@styled-icons/feather';
import { CldUploadWidget } from 'next-cloudinary';
import { MouseEventHandler, useState } from 'react';
import { isProduction } from 'types/constants';

export const UploadImage = ({ onSuccess }: { onSuccess: (url: string) => void }) => {
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
        }}
        signatureEndpoint="/api/cld"
        uploadPreset="clickdi"
        onSuccess={(result, widget) => {
          setResource(result?.info);
          const url = (result?.info as any)?.secure_url;
          if (url) {
            onSuccess(url);
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
              className="w-fit cursor-pointer rounded-lg border border-gray-300 p-4 transition-colors hover:bg-gray-100"
              onClick={handleOnClick}>
              <UploadCloud className="h-8 w-8 text-gray-700" />
            </button>
          );
        }}
      </CldUploadWidget>
      {!isProduction && (
        <a className="mt-2 block" href={resource?.secure_url} target="_blank">
          URL (debug): {resource?.secure_url.slice(-20) || '--'}
        </a>
      )}
    </div>
  );
};
