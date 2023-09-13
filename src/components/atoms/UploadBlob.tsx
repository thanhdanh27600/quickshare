import { Download, File, Image as ImageIcon, PlusCircle, Trash, UploadCloud } from '@styled-icons/feather';
import axios from 'axios';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { BASE_URL, LIMIT_FILE_UPLOAD } from 'types/constants';
import { isImage } from 'utils/media';
import { truncateMiddle } from 'utils/text';

export const UploadBlob = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleClearFile = () => {
    if (uploading) return;
    setSelectedFile(null);
    setDownloadUrl('');
    setError('');
  };

  const handleFile = (file: File) => {
    if (file.size > LIMIT_FILE_UPLOAD) {
      return setError('File size cannot be bigger than 10MB.');
    }
    setSelectedFile(file);
    setDownloadUrl('');
  };

  const handleFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!!event.dataTransfer.files?.length) {
      handleFile(event.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          fileName: selectedFile.name,
          fileType: selectedFile.type,
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
      console.log('uploadUrl', uploadUrl);
      if (!uploadUrl) {
        return setError('Please get the pre-signed URL first');
      }
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile?.type || '',
          'Access-Control-Allow-Origin': BASE_URL,
          'x-ms-blob-type': 'BlockBlob',
        },
      });
      console.log('File uploaded successfully');
      await handleFileDownload();
      setUploading(false);
    } catch (error) {
      setError('An error occurred while uploading file.');
      console.error(error);
    }
  };

  const handleFileDownload = async () => {
    if (!selectedFile) {
      return setError('Please select a file to download.');
    }

    try {
      const response = await axios.get(`api/azure/download`, {
        params: {
          fileName: selectedFile.name,
        },
      });

      setDownloadUrl(response.data.url);
    } catch (error) {
      setError('An error occurred while getting the download URL.');
      console.error(error);
    }
  };

  return (
    <div className="flex max-w-xs flex-col gap-4">
      <div className="flex w-fit flex-row items-center gap-2">
        <div className="flex" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
          <label
            className={clsx(
              'w-fit rounded-lg border border-gray-300 p-8 transition-colors hover:bg-gray-100',
              uploading && 'cursor-not-allowed opacity-30',
              !uploading && ' cursor-pointer ',
            )}>
            <input disabled={uploading} className="hidden" type="file" onChange={handleFileChange} />
            <div className="flex items-center gap-2">
              {!selectedFile ? (
                <PlusCircle className="h-6 w-6" />
              ) : !isImage(selectedFile.type) ? (
                <File className="h-6 w-6" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
              {!!selectedFile ? truncateMiddle(selectedFile.name, 15, 5) : <p className="">{'Select/Drop file'}</p>}
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-1">
          {!!selectedFile && !uploading && (
            <div
              className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-900"
              onClick={handleClearFile}>
              <Trash className="h-4 w-4 " />
              <p className="text-sm">Clear</p>
            </div>
          )}
          {!!selectedFile && !uploading && !downloadUrl && (
            <div
              className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-900"
              onClick={handleFileUpload}>
              <UploadCloud className="h-4 w-4 " />
              <p className="text-sm">Upload</p>
            </div>
          )}
          {!!downloadUrl && (
            <a
              target="_blank"
              href={downloadUrl}
              className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-900">
              <Download className="h-4 w-4 " />
              <p className="text-sm">Download</p>
            </a>
          )}
        </div>
      </div>
      {/* {!!selectedFile && !uploaded && (
        <Button onClick={handleFileUpload}>
          <div className="flex items-center gap-2">
            <UploadCloud className="h-6 w-6" />
            <p>Upload</p>
          </div>
        </Button>
      )} */}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
};
