import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function i18nGetStaticProps({ locale }) {
    return +(process?.env?.NEXT_PUBLIC_I18N_DISABLE || 0) ? { props: {} } : {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
        ])),
      },
    }
  }