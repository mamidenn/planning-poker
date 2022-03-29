import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Pusher, Toasts } from "context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Toasts>
      <Pusher>
        <Component {...pageProps} />
      </Pusher>
    </Toasts>
  );
}

export default MyApp;
