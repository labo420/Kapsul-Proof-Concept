const devDomain =
  process.env.REPLIT_EXPO_DEV_DOMAIN ??
  process.env.EXPO_PUBLIC_DOMAIN ??
  "";
const origin = devDomain ? `https://${devDomain}/` : "http://localhost:8081/";

export default {
  expo: {
    name: "Piclo",
    slug: "piclo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "piclo",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0f0f1a",
    },
    ios: {
      supportsTablet: false,
    },
    android: {
      backgroundColor: "#0f0f1a",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#0f0f1a",
      },
    },
    web: {
      favicon: "./assets/images/icon.png",
    },
    plugins: [
      [
        "expo-router",
        {
          origin,
        },
      ],
      "expo-font",
      "expo-web-browser",
      "@react-native-community/datetimepicker",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
