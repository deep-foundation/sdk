import nextEnv from 'next-env';
import dotenvLoad from 'dotenv-load';
dotenvLoad();
 
const withNextEnv = nextEnv();

 /** @type {import('next').NextConfig}*/
const config =  {
  distDir: 'app',
  strictMode: false,
  
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
}

export default withNextEnv(config);
