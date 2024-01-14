import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'deep.app',
  appName: 'deep-case',
  webDir: 'app',
  bundledWebRuntime: false,
  server: {
    url: "http://localhost:3008",
    cleartext: true,
  },
};

export default config;
