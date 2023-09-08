import { Button } from 'components/atoms/Button';
import TextEditor from 'components/gadgets/TextEditor';
import { tinymce } from 'types/constants';
import { useTrans } from 'utils/i18next';
import { copyToClipBoard } from 'utils/text';

export const NoteInput = () => {
  const { t } = useTrans();

  const onSubmit = () => {
    console.log(tinymce.activeEditor.getContent());
    copyToClipBoard(encodeURIComponent(tinymce.activeEditor.getContent()));
  };

  return (
    <div>
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
