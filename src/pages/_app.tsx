import ErrorBoundary from 'components/gadgets/ErrorBoundary';
import mixpanel from 'mixpanel-browser';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MIX_PANEL_TOKEN, Window, isProduction } from 'types/constants';
import { trackLanded } from 'types/utils';
import date from 'utils/date';
import '../styles/common.scss';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  if (!MIX_PANEL_TOKEN) {
    console.error('Mix panel Not found');
  } else {
    mixpanel.init(MIX_PANEL_TOKEN, {
      debug: !isProduction,
      loaded: trackLanded,
      ignore_dnt: isProduction,
    });
  }

  useEffect(() => {
    // debug zone
    if (Window()) {
      (window as any).date = date;
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster
          toastOptions={{
            success: {
              iconTheme: {
                primary: '#67E8F9',
                secondary: '#155E75',
              },
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default appWithTranslation(MyApp);
