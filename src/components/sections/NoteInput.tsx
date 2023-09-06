import { Button } from 'components/atoms/Button';
import { HelpTooltip } from 'components/gadgets/HelpTooltip';
import TextEditor from 'components/gadgets/TextEditor';
import { useRef } from 'react';
import { useTrans } from 'utils/i18next';

export const NoteInput = () => {
  const { t } = useTrans();
  const editorRef = useRef<any>(null);

  const onSubmit = () => {
    if (editorRef.current) {
      console.log(editorRef.current);
    }
  };

  return (
    <div className="solid rounded-lg border p-4 pt-8 shadow-xl sm:px-8 sm:py-8 sm:pt-10">
      <h1 className="mb-4 flex gap-1 text-4xl">
        {t('urlShortener')}
        <HelpTooltip />
      </h1>
      <TextEditor ref={editorRef} />
      <Button
        text={'Publish'}
        onClick={onSubmit}
        className="mx-auto mt-4 flex w-fit min-w-[5rem] justify-center"
        animation
      />
    </div>
  );
};
