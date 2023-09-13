import { getOrCreateNoteRequest } from 'api/requests';
import { AxiosError } from 'axios';
import { useBearStore } from 'bear';
import { Button } from 'components/atoms/Button';
import TextEditor from 'components/gadgets/TextEditor';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { tinymce } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { QueryKey } from 'utils/requests';
import { copyToClipBoard } from 'utils/text';

export const NoteInput = () => {
  const { t } = useTrans();

  const router = useRouter();
  const { noteSlice } = useBearStore();
  const [note, setNote] = noteSlice((state) => [state.note, state.setNote]);
  const [localError, setLocalError] = useState('');

  const requestNote = useMutation(QueryKey.SHORTEN, getOrCreateNoteRequest, {
    onMutate: (variables) => {
      setLocalError('');
    },
    onError: (error, variables, context) => {
      mixpanel.track(MIXPANEL_EVENT.NOTE_CREATE, {
        status: MIXPANEL_STATUS.FAILED,
        errorMessage: error,
        data: variables,
      });
    },
    onSuccess: (data, variables, context) => {
      console.log('data', data);
      if (data.note) {
        setNote(data.note);
        mixpanel.track(MIXPANEL_EVENT.NOTE_CREATE, {
          status: MIXPANEL_STATUS.OK,
          data,
        });
        const queryParams = { ...router.query, ...{ hash: data.note.hash } };
        router.push({ pathname: router.pathname, query: queryParams });
      } else {
        setLocalError(t('somethingWrong'));
        mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
          status: MIXPANEL_STATUS.INTERNAL_ERROR,
          urlRaw: variables,
        });
      }
    },
  });

  const mutateError = requestNote.error as AxiosError;
  const error = mutateError?.message || localError;

  const onSubmit = () => {
    console.log(tinymce.activeEditor.getContent());
    copyToClipBoard(encodeURIComponent(tinymce.activeEditor.getContent()));
  };

  return (
    <div>
      <TextEditor defaultValue={'<h2>haha</h2>'} />
      {error && <p className="mt-4 text-red-400">{error}</p>}
      <Button
        text={t('publish')}
        onClick={onSubmit}
        className="mx-auto mt-4 flex w-fit min-w-[5rem] justify-center"
        animation
      />
    </div>
  );
};
