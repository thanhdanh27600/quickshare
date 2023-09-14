import { createNoteRequest } from 'api/requests';
import { AxiosError } from 'axios';
import { useBearStore } from 'bear';
import { Button } from 'components/atoms/Button';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import { URLAdvancedSetting } from 'components/sections/URLAdvancedSetting';
import mixpanel from 'mixpanel-browser';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { tinymce } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { QueryKey } from 'utils/requests';
import { validateNoteSchema } from 'utils/validateMiddleware';
import { ZodError } from 'zod';
import { NoteUrlTile } from './NoteUrlTile';

const TextEditor = dynamic(() => import('../gadgets/TextEditor').then((c) => c.default), { ssr: false });

export const NoteInput = () => {
  const { t } = useTrans();

  const router = useRouter();
  const { noteSlice, shortenSlice, utilitySlice } = useBearStore();
  const ip = utilitySlice((state) => state.ip);
  const [note, setNote] = noteSlice((state) => [state.note, state.setNote]);
  const [setShortenHistory] = shortenSlice((state) => [state.setShortenHistory]);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const uid = query.get('uid') || '';
    if (!!uid) {
      requestNote.mutate({ hash: null, ip, text: '', uid });
    }
  }, []);

  const requestNote = useMutation(QueryKey.SHORTEN, createNoteRequest, {
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
      if (data.note) {
        setNote(data.note);
        if (data.note.UrlShortenerHistory) setShortenHistory(data.note.UrlShortenerHistory);
        mixpanel.track(MIXPANEL_EVENT.NOTE_CREATE, {
          status: MIXPANEL_STATUS.OK,
          data,
        });
        const queryParams = { ...router.query, ...{ uid: data.note.uid } };
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

  const loading = requestNote.isLoading;
  const mutateError = requestNote.error as AxiosError;
  const error = localError || mutateError?.message;

  const onSubmit = async () => {
    if (note) return; //TODO: update note
    setLocalError('');
    const data = {
      hash: null,
      uid: null,
      text: tinymce.activeEditor.getContent() || null,
      ip,
    };
    const validate = await validateNoteSchema.safeParse(data);
    if (!validate.success) {
      setLocalError(t((validate.error as ZodError<any>).issues[0].message as any));
    } else {
      const payload = validate.data;
      requestNote.mutate(payload);
    }
  };

  return (
    <div>
      <NoteUrlTile />
      <TextEditor key={note?.id} defaultValue={note?.text} />
      {error && <p className="mt-4 text-red-400">{error}</p>}
      <Button
        text={!!note ? t('save') : t('publish')}
        onClick={onSubmit}
        loading={loading}
        className="mx-auto mt-4 flex w-fit min-w-[5rem] justify-center"
        animation
      />
      {note && <URLAdvancedSetting defaultOpen={false} />}
      <FeedbackLink template={FeedbackTemplate.NOTE} />
    </div>
  );
};
