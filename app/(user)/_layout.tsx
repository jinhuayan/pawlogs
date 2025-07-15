import React, { useEffect, useRef, useState } from 'react';
import {  Pressable, View } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyProfileModal from '@/components/MyProfile';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendReminderNotification(token: string) {
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
        title: "Hey! Don't forget to add the Logs.",
        body: 'Check in and update your pet activity for the day 🐾',
      }),
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

export default function UserLayout() {

  const { user, isAdmin } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  console.log('User Details:', user);
  console.log('Is Admin:', isAdmin);
  const expoPushToken = usePushNotifications();

  const notificationCheckRef = useRef(false); // Prevents double sending

  useEffect(() => {

    const maybeSendNotification = async () => {
      const userId = user?.user_id;
      const userEmail = user?.email;

      if (!userId || !expoPushToken || notificationCheckRef.current) return;
      notificationCheckRef.current = true; // mark as already processed

      const isAdmin = userEmail?.toLowerCase().includes('admin');
      const intervalMs = isAdmin ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

      const storageKey = `last_notification_timestamp_${userId}`;
      try {
        const lastSentString = await AsyncStorage.getItem(storageKey);
        const now = Date.now();

        if (!lastSentString || now - parseInt(lastSentString, 10) > intervalMs) {
          await sendReminderNotification(expoPushToken);
          await AsyncStorage.setItem(storageKey, now.toString());
        }
      } catch (err) {
        console.error('Notification logic error:', err);
      }
    };

    if (user) {
      maybeSendNotification();
    }
  }, [user, expoPushToken]);

  if (!user) {
    return <Redirect href={'/'} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
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
          options={{ title: 'Pet View', headerBackVisible: false }}
        />
        <Stack.Screen name="pet-calendar"
          options={{ title: 'Pet Calendar' }}
        />
        <Stack.Screen name="pet-activity"
          options={{ title: 'Pet Activity' }}
        />
        <Stack.Screen name="edit-log"
          options={{ title: 'Edit Log' }}
        />
        <Stack.Screen name="create-pet"
          options={{ title: 'Edit Log' }}
        />
      </Stack>

      <MyProfileModal visible={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
