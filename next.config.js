const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
const { i18n } = require('./next-i18next.config');

dotenvLoad();
 
const withNextEnv = nextEnv();

 /** @type {import('next').NextConfig}*/
const config =  {
  ...(process.env.GITHUB_REPOSITORY ? {
    basePath: `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`,
  } : {}),
  distDir: 'app',
  strictMode: false,
  output: (+process.env.NEXT_PUBLIC_EXPORT) ? 'export' : 'standalone',
  
  webpack: (config) => {   
    config.resolve.fallback = {
      "buffer":false,
      "events": false,
      "os": false,
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
    };

    return config;
  },
  ...(+(process?.env?.NEXT_PUBLIC_I18N_DISABLE || 0) ? {} : { i18n }),
}

module.exports = withNextEnv(config);
