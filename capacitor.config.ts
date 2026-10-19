import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lhs.v7cerpv2',
  appName: 'Lighthouse ERP V2',
  webDir: 'www/browser',
    server: {
    androidScheme: 'http',  // Forces local assets to use http://localhost instead of https://
    cleartext: true
  }

};

export default config;
