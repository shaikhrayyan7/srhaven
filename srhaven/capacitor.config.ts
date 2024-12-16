import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: 'MyApp',
  webDir: 'www',
  plugins: {
    Camera: {
      android: {
        saveToGallery: true, // Ensure images are saved
      },
    },
  },
};
export default config;
