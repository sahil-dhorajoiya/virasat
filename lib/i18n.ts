import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'hi'],
};

export const getI18n = async (locale: string) => {
  const i18n = createInstance();

  await i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string) => import(`../locales/${language}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      defaultNS: 'common',
      fallbackNS: 'common',
      ns: ['common'],
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export const getStaticPaths = () => ({
  fallback: false,
  paths: i18nConfig.locales.map((lng) => ({
    params: {
      locale: lng,
    },
  })),
});

export const getStaticProps = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => ({
  props: {
    locale,
  },
});

export default i18nConfig; 