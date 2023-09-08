import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPage } from 'pages';
import { useEffect } from 'react';
import { isProduction } from 'types/constants';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';

const NoteComponent = ({ feature }: { feature: FeatureTabKey }) => {
  const { utilitySlice } = useBearStore();
  const [setFeatureTab] = utilitySlice((state) => [state.setFeatureTab]);

  useEffect(() => {
    if (isProduction) {
      location.href = '/';
      return;
    }
    setFeatureTab(FeatureTabKey.SHARE_TEXT);
  }, []);

  if (isProduction) return null;

  return <MainPage feature={feature} />;
};

const Note = pgFullDomain(NoteComponent, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    feature: FeatureTabKey.SHARE_TEXT,
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
  },
});

export default Note;
