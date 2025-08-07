import React, { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import MyProfileModal from '@/components/MyProfile';
import { useFetchNotification } from '@/api/settings';

type NotificationSetting = {
  id: number;
  role: 'admin' | 'foster'
  active: boolean
  interval_unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'
  interval_value: number
}

// Configure foreground behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function UserLayout() {
  const { user, isAdmin } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const expoPushToken = usePushNotifications();
  const { data: settings = [], refetch } = useFetchNotification({
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
  })

  useEffect(() => {
    // Always pull latest settings on mount
    refetch()
  }, [refetch])

  useEffect(() => {
    if (!user) {
      // On logout, clear all scheduled notifications
      Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }

    // Cancel previous schedules
    Notifications.cancelAllScheduledNotificationsAsync();

    // Find role-specific setting
    const roleKey = isAdmin ? 'admin' : 'foster'
    const setting = settings.find((s: NotificationSetting) => s.role === roleKey)

       // Guard against undefined
    if (!setting) {
      console.warn(`No notification setting found for role: ${roleKey}`)
      return
    }

    if (!setting.active) {
      // If inactive, skip scheduling
      return
    }

   // Request permission
    ;(async () => {
      const { status } = await Notifications.getPermissionsAsync()
      if (status !== 'granted') {
        const perm = await Notifications.requestPermissionsAsync()
        if (perm.status !== 'granted') {
          Alert.alert('Notifications disabled', 'Enable in settings to receive reminders.')
          return
        }
      }

      // convert interval to seconds
      let seconds = setting.interval_value
      switch (setting.interval_unit) {
        case 'minutes': seconds *= 60; break
        case 'hours': seconds *= 3600; break
        case 'days': seconds *= 86400; break
        case 'weeks': seconds *= 604800; break
        default: break
      }

      // schedule repeating
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hey! Don't forget to add the Logs 🐾",
          body: "Tap here to update your pet's activity.",
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
          repeats: true,
        },
      })
    })()
  }, [user, isAdmin, settings])

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.light.background },
          headerLeft: () => null,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16, paddingRight: 10 }}>
              {isAdmin && (
                <Pressable onPress={() => router.push('/admin-home')}>
                  {({ pressed }) => (
                    <MaterialIcons
                      name="admin-panel-settings"
                      size={20}
                      color={Colors.light.tint}
                      style={{ opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              )}
              <Pressable onPress={() => setShowProfile(true)}>
                {({ pressed }) => (
                  <AntDesign
                    name="setting"
                    size={20}
                    color={Colors.light.tint}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </View>
          ),
        }}
      >

        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="pets-view"
          options={{ title: 'Foster View', headerBackVisible: false, headerTitleAlign: 'center' }}
        />
        <Stack.Screen name="pet-calendar" />
        <Stack.Screen name="pet-activity"
          options={{ title: 'Pet Activity', headerTitleAlign: 'center' }}
        />
        <Stack.Screen name="edit-log"
          options={{ title: 'Edit Log', headerTitleAlign: 'center' }}
        />
        <Stack.Screen name="create-pet"
          options={{ title: 'Edit Log', headerTitleAlign: 'center' }}
        />
      </Stack>

      <MyProfileModal visible={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
