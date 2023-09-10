import { HelpTooltip } from 'components/gadgets/HelpTooltip';
import dynamic from 'next/dynamic';
import { useTrans } from 'utils/i18next';

const NoteInput = dynamic(() => import('../gadgets/NoteInput').then((c) => c.NoteInput), { ssr: false });

export const NoteSection = () => {
  const { t } = useTrans();
  return (
    <div>
      <h1 className="mb-4 flex gap-1 text-4xl">
        {t('urlShortener')}
        <HelpTooltip />
      </h1>
      <NoteInput />
    </div>
  );
};
