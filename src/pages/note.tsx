import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { RedirectShortDomain } from 'components/screens/RedirectShortDomain';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { isProduction } from 'types/constants';
import { LocaleProp } from 'types/locale';
import { pgFullDomain } from 'utils/guards';

const MainPage = dynamic(() => import('./index').then((c) => c.MainPage), { ssr: false });

const NoteComponent = () => {
  const { utilitySlice } = useBearStore();
  const [setFeatureTab] = utilitySlice((state) => [state.setFeatureTab]);

  useEffect(() => {
    if (isProduction) location.href = '/';
    setFeatureTab(FeatureTabKey.SHARE_TEXT);
  }, []);

  if (isProduction) return null;

  return <MainPage />;
};

const Note = pgFullDomain(NoteComponent, { returnIfFalse: RedirectShortDomain });

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
  },
});

export default Note;
