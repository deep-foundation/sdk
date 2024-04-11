import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function i18nGetStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
        ])),
      },
    }
  }