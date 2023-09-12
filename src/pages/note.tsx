import { FeatureTabKey } from 'bear/utilitySlice';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPage } from 'pages';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';
import { defaultLocale } from 'utils/i18next';

const NoteComponent = ({ feature }: { feature: FeatureTabKey }) => {
  return <MainPage feature={feature} />;
};

const Note = pgFullDomain(NoteComponent, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    feature: FeatureTabKey.SHARE_TEXT,
    ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
  },
});

export default Note;
