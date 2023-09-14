import { useBearStore } from 'bear';
import { LayoutMain } from 'components/layouts/LayoutMain';
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
      {shortenHistory && (
        <>
          <URLAdvancedSetting defaultOpen={false} shortenUrl={shortenUrl} />
          <hr className="my-4" />
        </>
      )}
      <TrackingClick hash={hash} />
    </LayoutMain>
  );
};
