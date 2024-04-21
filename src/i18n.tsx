import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import axios from 'axios';

import { createConfig } from "next-i18next/dist/commonjs/config/createConfig";
import createClient from 'next-i18next/dist/commonjs/createClient';
import i18nConfig from '../next-i18next.config';
import { useRouter } from "next/router";

export async function i18nGetStaticProps({ locale }) {
  return +(process?.env?.NEXT_PUBLIC_I18N_DISABLE || 0) ? { props: {} } : {
    props: {
      ...(await serverSideTranslations(locale, i18nConfig.i18n.requiredNamespaces)),
    },
  }
}

export function CustomI18nProvider({ children }: { children?: any }) {
  const router = useRouter();
  const [instance, setInstance] = useState();
  useEffect(() => { (async () => {
    if (!(+(process?.env?.NEXT_PUBLIC_I18N_DISABLE || 0))) {
      console.log('CustomI18nProvider', 'ignore');
      return undefined;
    } else {
      console.log('CustomI18nProvider', 'initialize');
    }
    const locale = i18nConfig.i18n.defaultLocale;
    const namespaces = {};
    for (let n in i18nConfig.i18n.requiredNamespaces) {
      namespaces[i18nConfig.i18n.requiredNamespaces[n]] = (await axios(`${router.basePath}/locales/${locale}/${i18nConfig.i18n.requiredNamespaces[n]}.json`) as any)?.data;
    }
    const resources = {
      [locale]: namespaces,
    };
    const config = {
      ...createConfig({
        ...i18nConfig,
        lng: locale,
      }),
      lng: locale,
      resources,
    };
    console.log('CustomI18nProvider', config);
    const instance = createClient(config).i18n;
    setInstance(instance);
  })(); }, []);

  return instance ? <I18nextProvider i18n={instance}>
    {children}
  </I18nextProvider> : <>{children}</>;
}