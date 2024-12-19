import 'dotenv/config';

export default {
  expo: {
    name: "dogInTown-frontend",
    slug: "dogInTown-frontend",
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
    ],
  },
};
