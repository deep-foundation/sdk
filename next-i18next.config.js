module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    localeDetection: true,
    requiredNamespaces: ['common'],
  },
};