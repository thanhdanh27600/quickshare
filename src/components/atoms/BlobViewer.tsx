import { Media } from '@prisma/client';
import { File, Image as ImageIcon } from '@styled-icons/feather';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTrans } from 'utils/i18next';
import { isImage } from 'utils/media';
import { truncateMiddle } from 'utils/text';

export const BlobViewer = ({ media }: { media: Media }) => {
  const { t } = useTrans();
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    handleFileDownload();
  }, []);

  const handleFileDownload = async (event?: any) => {
    event?.preventDefault();
    if (!media) return;
    try {
      const response = await axios.get(`/api/azure/download`, {
        params: {
          fileName: media.name,
        },
      });
      setDownloadUrl(response.data.url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <a
        target="_blank"
        href={downloadUrl}
        className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-900">
        <div
          className={clsx(
            'flex w-full flex-col items-center rounded-lg border border-gray-300 p-6 py-10 transition-colors',
            { 'cursor-not-allowed opacity-30': !downloadUrl },
            { 'cursor-pointer hover:bg-gray-100': downloadUrl },
          )}>
          <div className="flex items-center gap-2 text-gray-700">
            {isImage(media.type) ? <ImageIcon className="w-6" /> : <File className="w-6" />}
            <div>
              <span className="max-sm:hidden">{truncateMiddle(media?.name || '', 50, 5)}</span>
              <span className="sm:hidden">{truncateMiddle(media?.name || '', 20, 5)}</span>
            </div>
          </div>
          <div className="absolute bottom-2 flex gap-4"></div>
        </div>
      </a>
    </div>
  );
};
