// hooks/usePushNotifications.ts
import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const hasRegistered = useRef(false); // prevent duplicate registration

  useEffect(() => {
    if (hasRegistered.current) return;
    hasRegistered.current = true;

    const register = async () => {
      if (!Device.isDevice) {
        console.warn('Must use a physical device for push notifications.');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permission denied for push notifications.');
        return;
      }

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        console.log('Expo Push Token:', tokenData.data);
        setExpoPushToken(tokenData.data);
      } catch (error) {
        console.error('Error getting Expo push token:', error);
      }
    };

    register();
  }, []);

  return expoPushToken;
};
