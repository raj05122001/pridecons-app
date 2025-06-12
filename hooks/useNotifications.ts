// src/hooks/useNotifications.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export function usePushToken() {
  const [expoPushToken, setExpoPushToken] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      // 1) Device check
      if (!Device.isDevice) {
        console.warn('Must use physical device for Push Notifications');
        return;
      }

      // 2) Permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token permissions!');
        return;
      }

      // 3) Get Expo Push Token
      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data);
      console.log('Expo Push Token:', tokenData.data);
    })();
  }, []);

  return expoPushToken;
}
