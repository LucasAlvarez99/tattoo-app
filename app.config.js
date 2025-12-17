// app.config.js - Configuración de Expo para builds
export default {
  expo: {
    name: "Tattoo Manager",
    slug: "tattoo-app",
    owner: "lucas_alvarez",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tattoomanager.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.tattoomanager.app",
      versionCode: 1,
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-image-picker",
      "expo-notifications"
    ],
    extra: {
      eas: {
        projectId: "5da9f8be-ba0a-48b0-bd10-fb3770c1b4f3"
      }
    }
  }
};