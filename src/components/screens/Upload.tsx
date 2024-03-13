import { Attachments } from 'components/gadgets/Attachments';
import { HelpTooltip } from 'components/gadgets/shared/HelpTooltip';
import { useTrans } from 'utils/i18next';

export const Upload = () => {
  const { t } = useTrans();

  return (
    <>
      <h1 className="mb-4 flex gap-1 text-3xl">
        {t('uploadFile')}
        <HelpTooltip text={t('helpNoteHead')} />
      </h1>
      <Attachments
        onChange={(attachment) => {
          console.log(attachment);
        }}
      />
    </>
  );
};
