import 'dotenv/config';

export default {
  expo: {
    assetBundlePatterns: [
      "**/*"
    ],
    name: "dogInTown-frontend",
    slug: "dogintown",
    owner: "mistersupraez",
    android: {
      "softInputMode": "adjustResize"
    },
    extra: {
      eas: {
        projectId: "b1ef12f5-49d9-4c9f-90bd-f831155ce39a" 
      }, 
    },
    updates: {
      url: "https://u.expo.dev/b1ef12f5-49d9-4c9f-90bd-f831155ce39a", // URL de mise à jour
    },
    runtimeVersion: {
      policy: "appVersion", // Politique de version pour les mises à jour
    },
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon-custom.png",
      resizeMode: "contain",
      backgroundColor: "#F7CC99",
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.API_GOOGLE_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.API_GOOGLE_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends.",
        },
      ],
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/LeagueSpartan-Medium.ttf"]
        }
      ],
    ],
  },
};
