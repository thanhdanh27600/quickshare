import { Input } from 'components/atoms/Input';
import noteSlice from 'store/noteSlice';
import { LIMIT_NOTE_TITLE_LENGTH } from 'types/constants';
import { useTrans } from 'utils/i18next';

export const NoteTitleInput = () => {
  const { t } = useTrans();
  const [note, setNote] = noteSlice((state) => [state.note, state.setNote]);

  const onTitleChange = ({ target: { value } }: any) => {
    setNote({ title: value || '' });
  };

  return (
    <Input
      className="mb-2 bg-white"
      btnSize="md"
      maxLength={LIMIT_NOTE_TITLE_LENGTH}
      placeholder={t('title')}
      onChange={onTitleChange}
      onBlur={onTitleChange}
      defaultValue={note?.title || ''}
    />
  );
};
