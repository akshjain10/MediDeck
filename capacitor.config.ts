import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arihantmedigens.app',
  appName: 'Arihant Medigens',
  webDir: 'dist',
  plugins: {
      SplashScreen: {
          launchShowDuration: 2000,
          backgroundColor: "#ffffff",
          showSpinner: false,
          androidSpinnerStyle: "small",
          splashFullScreen: true,
          splashImmersive: true,
          },
      },
};

export default config;
