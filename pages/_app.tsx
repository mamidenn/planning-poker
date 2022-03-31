import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toasts } from "context";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Toasts>
      <Head>
        <title>Planning Poker</title>
      </Head>
      <Component {...pageProps} />
    </Toasts>
  );
}

export default MyApp;
