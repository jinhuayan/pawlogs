import React, { useEffect, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendLoginReminderNotification(token: string) {
  if (!token) return;

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: 'Reminder to Update Logs',
        body: 'Please remember to update your pet activity logs today!',
      }),
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

export default function UserLayout() {
  const { session } = useAuth();
  const expoPushToken = usePushNotifications();

  // To avoid multiple sends, use a local state to track notification sent once per login
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (session && expoPushToken && !notificationSent) {
      sendLoginReminderNotification(expoPushToken);
      setNotificationSent(true); // mark sent so no repeat on re-render
    }
  }, [session, expoPushToken, notificationSent]);

  if (!session) {
    return <Redirect href={'/'} />;
  }

  const handleLogout = () => {
    supabase.auth
      .signOut()
      .then(() => {
        router.push('/');
      })
      .catch(error => {
        Alert.alert('Logout Error', error.message);
      });
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerLeft: () => null,
        headerRight: () => (
          <Pressable onPress={handleLogout}>
            {({ pressed }) => (
              <FontAwesome
                name="sign-out"
                size={20}
                color={Colors.light.tint}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="pets-view"
        options={{
          title: 'Pet Views',
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
