import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { useEffect } from "react";


export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
   if (typeof(window) === "object") defineCustomElements(window);
  });
  return <Component {...pageProps} />
}

