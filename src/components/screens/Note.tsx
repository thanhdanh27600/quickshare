import { HelpTooltip } from 'components/gadgets/shared/HelpTooltip';
import dynamic from 'next/dynamic';
import { useTrans } from 'utils/i18next';

const NoteInput = dynamic(() => import('../sections/NoteInput').then((c) => c.NoteInput), { ssr: false });

export const Note = () => {
  const { t } = useTrans();

  return (
    <>
      <h1 className="mb-4 flex gap-1 text-3xl">
        {t('noteEditor')}
        <HelpTooltip text={t('helpNoteHead')} />
      </h1>
      <NoteInput />
    </>
  );
};
