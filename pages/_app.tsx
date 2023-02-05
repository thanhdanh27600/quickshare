import "../styles/globals.css";
import type {AppProps} from "next/app";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

function MyApp({Component, pageProps}: AppProps) {
	return (
		<>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Itim&display=swap"
				rel="stylesheet"
			/>
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} />
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
