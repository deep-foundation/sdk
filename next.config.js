import nextEnv from 'next-env';
import dotenvLoad from 'dotenv-load';
dotenvLoad();
 
const withNextEnv = nextEnv();

 /** @type {import('next').NextConfig}*/
const config =  {
  distDir: 'app',
  strictMode: false,
  transpilePackages: ['@deep-foundation/capacitor-motion'],
  
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
}

export default withNextEnv(config);