import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sdk.app',
  appName: 'SDK',
  webDir: 'app',
  bundledWebRuntime: false,
  server: {
    url: "http://localhost:3008",
    cleartext: true,
  },
};

export default config;
