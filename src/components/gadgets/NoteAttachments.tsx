import { Media } from '@prisma/client';
import { Plus, Trash2 } from '@styled-icons/feather';
import { useBearStore } from 'bear';
import { BlobUploader } from 'components/atoms/BlobUploader';
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTrans } from 'utils/i18next';

const MAX_ATTACHMENTS = 3;

type BlobForm = {
  blobs: Media[];
};

export const NoteAttachments = () => {
  const { t } = useTrans();
  const { noteSlice } = useBearStore();
  const [note, setNote] = noteSlice((state) => [state.note, state.setNote]);

  const methods = useForm<BlobForm>({
    defaultValues: {
      blobs: note?.Media || [],
    },
  });

  const { control, watch, setValue } = methods;
  const attachments = watch('blobs');

  useEffect(() => {
    setNote({ Media: attachments });
  }, [attachments]);

  useEffect(() => {
    setValue('blobs', note?.Media || []);
  }, [note?.Media?.length]);

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
      <div className="mt-4">
        <h2 className="text-sm text-gray-700">{t('attachmentsCreate')}</h2>
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
            Reset files
          </div>
        )}
        {fields.length < MAX_ATTACHMENTS && (
          <div
            className="mt-2 flex w-fit cursor-pointer items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
            onClick={onAdd}>
            <Plus className="w-4 cursor-pointer" />
            {t('addAttachment')}
          </div>
        )}
      </div>
    </FormProvider>
  );
};
