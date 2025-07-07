import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    alert('Starting push notification registration...');

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log('Expo Push Token:', token);
        alert('Expo Push Token received:\n' + token);
        setExpoPushToken(token);
      } else {
        alert('Failed to get Expo Push Token.');
      }
    });
  }, []);

  return expoPushToken;
};

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Must use a physical device for push notifications.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permission denied for push notifications.');
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (error) {
    alert('Error getting Expo push token: ' + error.message);
    console.error(error);
    return null;
  }
}
