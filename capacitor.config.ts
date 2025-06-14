
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d090915eaec9488a85d3b8ef19ab7329',
  appName: 'circle-fund-nexus',
  webDir: 'dist',
  server: {
    url: 'https://d090915e-aec9-488a-85d3-b8ef19ab7329.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    minSdkVersion: 24, // Android 7.0 (API level 24)
    compileSdkVersion: 34,
    targetSdkVersion: 34
  },
  ios: {
    minSdkVersion: '10.0' // iPhone 6 runs iOS 10+
  }
};

export default config;
