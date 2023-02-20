import mixpanel from 'mixpanel-browser';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { isProduction, MIX_PANEL_TOKEN } from 'types/constants';
import { trackLanded } from 'types/utils';
import { log } from 'utils/clg';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!MIX_PANEL_TOKEN) return;
    mixpanel.init(MIX_PANEL_TOKEN, {
      debug: !isProduction,
      loaded: trackLanded,
    });
    !isProduction && log(['Mix panel loaded', MIX_PANEL_TOKEN]);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
