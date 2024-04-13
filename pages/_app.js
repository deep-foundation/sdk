import { appWithTranslation } from 'next-i18next';
import { Provider } from '../src/provider';

function App({ Component, pageProps }) {
  return (
    <>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default appWithTranslation(App);
