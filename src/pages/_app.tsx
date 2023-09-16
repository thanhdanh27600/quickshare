import ErrorBoundary from 'components/gadgets/ErrorBoundary';
import mixpanel from 'mixpanel-browser';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { any } from 'ramda';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BASE_URL, MIX_PANEL_TOKEN, Window, alternateBrandUrl, isProduction } from 'types/constants';
import { trackLanded } from 'types/utils';
import '../styles/common.scss';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
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
    const host = Window()?.location?.host;
    if (!host) return;
    if (any((url) => url.includes(host), alternateBrandUrl)) {
      window.location.href = BASE_URL;
    }
    const _ = new (window as any).ClipboardJS('.btn-copy');
    // Google Ads
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...a: any[]) {
      (window as any).dataLayer.push(a);
    }
    gtag('js', new Date());
    gtag('config', 'G-LE8KPBMBMD');
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
        <Toaster
          toastOptions={{
            success: {
              iconTheme: {
                primary: '#10bee8',
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
