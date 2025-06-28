import 'dotenv/config';

export default {
  expo: {
    name: "PawLog",
    slug: "pawlog",
    version: "1.0.0",
    scheme: "pawlogs",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "b7100f6d-40ed-4055-abde-a1dba6a972d5", // ✅ REQUIRED for EAS Build
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSUserNotificationUsageDescription:
          "This app uses notifications to remind you to log pet activities daily.",
      },
    },
    android: {
      package: "com.naitik.pawlogs",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: ["NOTIFICATIONS"],
      useNextNotificationsApi: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
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
      "expo-notifications",
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
