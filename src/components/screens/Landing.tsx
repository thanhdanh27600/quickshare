import { CloudCheck, DatabaseLock, EmojiSmile } from '@styled-icons/bootstrap';
import { useTrans } from 'utils/i18next';

const LandingCard = ({ title, subtitle, Icon }: any) => {
  return (
    <div className="block basis-full rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 md:max-w-sm">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <Icon className="h-6 w-6" />
        <h5 className="text-xl font-medium tracking-tight text-gray-900">{title}</h5>
      </div>
      <p className="mt-4 font-normal text-gray-700">{subtitle}</p>
    </div>
  );
};

export const Landing = () => {
  const { t } = useTrans();
  return (
    <section className="landing mt-24">
      <div className="flex flex-col gap-6 max-md:items-center md:flex-row">
        <LandingCard title={t('landing.card1' as any)} subtitle={t('landing.card1-content' as any)} Icon={CloudCheck} />
        <LandingCard
          title={t('landing.card2' as any)}
          subtitle={t('landing.card2-content' as any)}
          Icon={DatabaseLock}
        />
        <LandingCard title={t('landing.card3' as any)} subtitle={t('landing.card3-content' as any)} Icon={EmojiSmile} />
      </div>
      <div className="my-16" style={{ background: 'url(/assets/dot.png) rgba(0,0,0,.01)', minHeight: '32px' }} />
      <h2 className="text-2xl font-medium">{t('landing.p1-head' as any)}</h2>
      <div className="mt-4 leading-6" dangerouslySetInnerHTML={{ __html: t('landing.p1' as any) }}></div>
      <h2 className="mt-8 text-2xl font-medium">{t('landing.p2-head' as any)}</h2>
      <div className="mt-4 leading-6" dangerouslySetInnerHTML={{ __html: t('landing.p2' as any) }}></div>
    </section>
  );
};
