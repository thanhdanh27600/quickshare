import { URLShare } from 'components/gadgets/URLShare';
import { ShortenUrlTile } from 'components/gadgets/URLShortener/ShortenUrlTile';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import { URLAdvancedSetting } from 'components/sections/URLAdvancedSetting';
import mixpanel from 'mixpanel-browser';
import Head from 'next/head';
import { useEffect } from 'react';
import { useBearStore } from 'store';
import { isProduction } from 'types/constants';
import { MIXPANEL_EVENT } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { TrackingClick } from './TrackingClick';

export const URLTracking = ({ hash }: { hash: string }) => {
  const { t } = useTrans();
  const { shortenSlice } = useBearStore();
  const [shortenHistory] = shortenSlice((state) => [state.shortenHistory, state.getShortenUrl()]);

  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.TRACKING);
  }, []);

  return (
    <LayoutMain featureTab={false}>
      <Head>{isProduction && <title>{`${t('trackingLink')} | ${hash}`}</title>}</Head>
      <TrackingClick hash={hash} />
      {shortenHistory?.id && (
        <>
          <div className="mt-8">
            <ShortenUrlTile />
            <URLShare />
            <URLAdvancedSetting />
          </div>
          <div className="m-4">
            <FeedbackLink template={FeedbackTemplate.URL_TRACKING} />
          </div>
        </>
      )}
    </LayoutMain>
  );
};
