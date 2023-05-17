const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
dotenvLoad();
 
const withNextEnv = nextEnv();
 
module.exports = withNextEnv({
  distDir: 'app',
  strictMode: false,
  
  webpack: (config) => {
    const oldEntriesPromise = config.entry();

    // config.entry = async () => {
    //   const oldEntries = await oldEntriesPromise;
    //   return {
    //     ...oldEntries,
    //     "firebase-messaging-sw": {
    //       import: './imports/firebase-messaging-sw.ts',
    //       filename: '../public/firebase-messaging-sw.js',
    //     },
    //     "sw": {
    //       import: './imports/sw.ts',
    //       filename: '../public/sw.js',
    //     }
    //   }
    // };
    
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
});