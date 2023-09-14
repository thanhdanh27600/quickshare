import { HelpTooltip } from 'components/gadgets/HelpTooltip';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { isProduction } from 'types/constants';
import { useTrans } from 'utils/i18next';

const NoteInput = dynamic(() => import('../gadgets/NoteInput').then((c) => c.NoteInput), { ssr: false });

export const NoteSection = () => {
  const { t } = useTrans();

  return (
    <>
      <Head>{isProduction && <title>{t('brandTitleNote')}</title>}</Head>
      <h1 className="mb-4 flex gap-1 text-3xl">
        {t('noteEditor')}
        <HelpTooltip text={t('helpNoteHead')} />
      </h1>
      <NoteInput />
    </>
  );
};
