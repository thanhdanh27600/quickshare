import { useBearStore } from 'bear';
import { ShortenUrlTile } from 'components/gadgets/ShortenUrlTile';
import { URLShare } from 'components/gadgets/URLShare';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import { URLAdvancedSetting } from 'components/sections/URLAdvancedSetting';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { MIXPANEL_EVENT } from 'types/utils';
import { TrackingClick } from './TrackingClick';

export const URLTracking = ({ hash }: { hash: string }) => {
  const { shortenSlice } = useBearStore();
  const [shortenHistory, shortenUrl] = shortenSlice((state) => [state.shortenHistory, state.getShortenUrl()]);

  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.TRACKING);
  }, []);

  return (
    <LayoutMain featureTab={false}>
      <TrackingClick hash={hash} />
      {shortenHistory?.id && (
        <>
          <div className="mt-8">
            <ShortenUrlTile />
            <URLShare />
            <URLAdvancedSetting defaultOpen={false} shortenUrl={shortenUrl} />
          </div>
          <div className="m-4">
            <FeedbackLink template={FeedbackTemplate.URL_TRACKING} />
          </div>
        </>
      )}
    </LayoutMain>
  );
};
