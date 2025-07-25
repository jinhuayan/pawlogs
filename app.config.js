import 'dotenv/config';

export default {
  expo: {
    name: "PawLog",
    slug: "pawlog",
    version: "1.0.0",
    scheme: "pawlog",
    android: {
      package: "com.naitikpatel2410.pawlog",
      useNextNotificationsApi: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,

      //  Added for Firebase push notification support
      googleServicesFile: "./android/app/google-services.json",
    },
    ios: {
      bundleIdentifier: "com.naitikpatel2410.pawlog",
      supportsTablet: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "b7100f6d-40ed-4055-abde-a1dba6a972d5",
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",

      // Add the localization plugin if using expo-localization
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
