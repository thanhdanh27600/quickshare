import { Media } from '@prisma/client';
import { Plus, Trash2 } from '@styled-icons/feather';
import { BlobUploader } from 'components/atoms/BlobUploader';
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTrans } from 'utils/i18next';

const MAX_ATTACHMENTS = 3;

type BlobForm = {
  blobs: Media[];
};

export const Attachments = ({
  maxAttachments = MAX_ATTACHMENTS,
  defaultValues,
  onChange,
}: {
  maxAttachments?: number;
  defaultValues?: Media[] | null;
  onChange: (attatchments: Media[]) => void;
}) => {
  const { t } = useTrans();
  const methods = useForm<BlobForm>();

  const { control, watch, reset } = methods;
  const attachments = watch('blobs');

  useEffect(() => {
    if (defaultValues) reset({ blobs: defaultValues || [{ id: -1 } as any] });
  }, [defaultValues]);

  useEffect(() => {
    if (onChange) onChange(attachments);
  }, [attachments]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'blobs',
  });

  const onDelete = () => {
    remove();
  };

  const onAdd = () => {
    append({ id: -1 } as any);
  };

  return (
    <FormProvider {...methods}>
      {fields.map((field, index) => {
        return (
          <div className="relative my-4" key={`blob-${index}`}>
            <BlobUploader selectedMedia={attachments[index]} name={`blobs.${index}`} />
          </div>
        );
      })}
      {fields.length > 0 && (
        <div
          className="mt-2 flex w-fit cursor-pointer items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
          onClick={onDelete}>
          <Trash2 onClick={onDelete} className="w-4 cursor-pointer" />
          {t('resetFiles')}
        </div>
      )}
      {fields.length < maxAttachments && (
        <div
          className="mt-2 flex w-fit cursor-pointer items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
          onClick={onAdd}>
          <Plus className="w-4 cursor-pointer" />
          {t('addAttachment')}
        </div>
      )}
    </FormProvider>
  );
};
