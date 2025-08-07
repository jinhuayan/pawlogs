import 'dotenv/config';

export default {
  expo: {
    name: "PawLogs",
    slug: "pawlog",
    version: "1.0.0",
    scheme: "pawlog",
    icon: "./assets/images/icon.png", // 1024x1024, no transparency

    android: {
      package: "com.naitikpatel2410.pawlog",
      useNextNotificationsApi: true,
      edgeToEdgeEnabled: true,

      // Temporarily remove this to avoid prebuild error
      // googleServicesFile: "./android/app/google-services.json",

      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png", // should include transparent padding
        backgroundColor: "#ffffff"
      }
    },

    ios: {
      bundleIdentifier: "com.naitikpatel2410.pawlog",
      supportsTablet: true
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png"
    },

    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "b7100f6d-40ed-4055-abde-a1dba6a972d5"
      }
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png", // used for splash screen
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store",
      "expo-localization"
    ],

    experiments: {
      typedRoutes: true
    }
  }
};
