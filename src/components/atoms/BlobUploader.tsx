import { Media } from '@prisma/client';
import { CheckCircle, Download, File, Image as ImageIcon, PlusCircle, Trash } from '@styled-icons/feather';
import axios from 'axios';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from 'requests/api';
import { BASE_URL, LIMIT_FILE_UPLOAD } from 'types/constants';
import { useTrans } from 'utils/i18next';
import { UploadProvider, isImage } from 'utils/media';
import { truncateMiddle } from 'utils/text';

interface Props {
  name?: string;
  selectedMedia?: Media;
}

export const BlobUploader = ({ name = '', selectedMedia }: Props) => {
  const { t } = useTrans();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileName = useMemo(() => selectedMedia?.name || selectedFile?.name || 'No name', [selectedFile, selectedMedia]);
  const fileType = useMemo(() => selectedMedia?.type || selectedFile?.type || null, [selectedFile, selectedMedia]);
  const hasSelected = (selectedMedia?.id || -1) > 0;
  const hasFile = !!hasSelected || !!selectedFile;

  const { setValue } = useFormContext();

  useEffect(() => {
    if (!!selectedFile) {
      handleFileUpload();
    }
  }, [selectedFile]);

  useEffect(() => {
    if (hasSelected) {
      handleFileDownload();
    }
  }, [hasSelected]);

  const handleDelete = (event?: any) => {
    event?.preventDefault();
    if (uploading) return;
    setValue(`${name}.id`, -1);
    setSelectedFile(null);
    setDownloadUrl('');
    setError('');
  };

  const handleFile = (file: File) => {
    if (file.size > LIMIT_FILE_UPLOAD) {
      return setError('File size cannot be bigger than 20MB.');
    }
    setSelectedFile(file);
    setDownloadUrl('');
  };

  const handleFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!!selectedFile) return;
    event.preventDefault();
    if (!!event.dataTransfer.files?.length) {
      handleFile(event.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!!selectedFile) return;
    if (uploading) return;
    setError('');
    if (!!event.target.files?.length) {
      handleFile(event.target.files[0]);
    }
  };

  const getPresignedUrl = async () => {
    if (!selectedFile) {
      return setError('Please select a file to upload');
    }
    try {
      const response = await axios.get(`/api/azure/presigned`, {
        params: {
          fileName,
          fileType,
        },
      });
      return response.data.url;
    } catch (error) {
      setError('An error occurred while getting the pre-signed URL.');
      console.error(error);
    }
  };

  const handleFileUpload = async () => {
    try {
      setUploading(true);
      const uploadUrl = await getPresignedUrl();
      if (!uploadUrl) {
        return setError('Please get the pre-signed URL first');
      }
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': fileType,
          'Access-Control-Allow-Origin': BASE_URL,
          'x-ms-blob-type': 'BlockBlob',
        },
      });
      console.log('File uploaded successfully');
      const imageRs = await API.post('/api/i', {
        url: uploadUrl,
        name: fileName,
        type: fileType,
        provider: UploadProvider.AZURE,
      });
      setValue(`${name}.name`, imageRs.data.name);
      setValue(`${name}.type`, imageRs.data.type);
      setValue(`${name}.id`, imageRs.data.id);
      await handleFileDownload();
      setUploading(false);
    } catch (error) {
      setError('An error occurred while uploading file.');
      console.error(error);
    }
  };

  const handleFileDownload = async (event?: any) => {
    event?.preventDefault();
    if (!selectedFile && !selectedMedia) {
      return setError('Please select a file to download.');
    }

    try {
      const response = await axios.get(`/api/azure/download`, {
        params: {
          fileName,
        },
      });
      setValue(`${name}.url`, response.data.url);
      setDownloadUrl(response.data.url);
    } catch (error) {
      setError('An error occurred while getting the download URL.');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
        <label
          className={clsx(
            'flex w-full flex-col items-center rounded-lg border border-gray-300 p-10 transition-colors',
            !hasFile && 'pb-10 hover:bg-gray-100',
            hasFile && 'pb-14',
            uploading && 'cursor-not-allowed opacity-30',
            !uploading && !selectedFile && ' cursor-pointer',
          )}>
          <input
            key={fileName}
            disabled={uploading || hasFile}
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-2 text-gray-700">
            {!hasFile ? (
              <PlusCircle className="w-6" />
            ) : !isImage(fileType) ? (
              <File className="w-6" />
            ) : (
              <ImageIcon className="w-6" />
            )}
            {!!hasFile ? (
              <div>
                <span className="max-sm:hidden">{truncateMiddle(fileName, 50, 5)}</span>
                <span className="sm:hidden">{truncateMiddle(fileName, 20, 5)}</span>
                {downloadUrl ? (
                  <CheckCircle className="mb-1 ml-2 w-4 stroke-2 text-green-500" />
                ) : (
                  <CheckCircle className="mb-1 ml-2 w-4 stroke-2 text-gray-500" />
                )}
              </div>
            ) : (
              <p className="max-sm:text-sm">{t('selectOrDropFiles')}</p>
            )}
          </div>
          <div className="absolute bottom-2 flex gap-4">
            {!!downloadUrl && (
              <a
                download={fileName}
                target="_blank"
                href={downloadUrl}
                className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-900">
                <Download className="h-4 w-4 " />
                <p className="text-sm">Download</p>
              </a>
            )}
            {hasFile && (
              <div
                className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-900"
                onClick={handleDelete}>
                <Trash className="h-4 w-4 " />
                <p className="text-sm">Delete</p>
              </div>
            )}
          </div>
        </label>
      </div>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
};
