import { Button } from 'components/atoms/Button';
import { HelpTooltip } from 'components/gadgets/HelpTooltip';
import TextEditor from 'components/gadgets/TextEditor';
import { tinymce } from 'types/constants';
import { useTrans } from 'utils/i18next';

export const NoteInput = () => {
  const { t } = useTrans();


  const onSubmit = () => {
      console.log(tinymce.activeEditor.getContent())
  };

  return (
    <div className="solid rounded-lg border p-4 pt-8 shadow-xl sm:px-8 sm:py-8 sm:pt-10">
      <h1 className="mb-4 flex gap-1 text-4xl">
        {t('urlShortener')}
        <HelpTooltip />
      </h1>
      <TextEditor defaultValue={'<h2>haha</h2>'} />
      <Button
        text={t('publish')}
        onClick={onSubmit}
        className="mx-auto mt-4 flex w-fit min-w-[5rem] justify-center"
        animation
      />
    </div>
  );
};
