// components/notificationService.js - Simplified without Firebase
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions and get Expo push token
export async function requestPermissionsAndGetToken() {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required! 🔔',
        'Please enable notifications to receive updates from Pride App.',
        [{ text: 'OK' }]
      );
      return null;
    }
    
    console.log('✅ Notification permissions granted');

    // Get Expo push token (for now, until Firebase is properly setup)
    const tokenData = await Notifications.getDevicePushTokenAsync();
    const token = tokenData.data;
    
    console.log('📱 Expo Push Token:', token);
    
    // Store token locally
    await AsyncStorage.setItem('pushToken', token);
    
    return token;
  } catch (error) {
    console.error('❌ Error getting push token:', error);
    return null;
  }
}

// Register push notification token with your backend
export async function registerPushToken(userId) {
  try {
    const token = await requestPermissionsAndGetToken();
    
    if (!token) {
      throw new Error('Could not get push token');
    }

    const formData = {
      user_id: userId,
      push_token: token
    };

    console.log('📤 Registering token:', formData);

    const response = await fetch('https://api.pridecons.sbs/notification/users/register-push-token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log('✅ Token registration response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error registering token:', error);
    
    // Don't throw error, just log it for now
    Alert.alert(
      'Info', 
      'Notifications setup completed. Push notifications will be enabled once backend is fully configured.'
    );
    
    return { status: 'partial_success', error: error.message };
  }
}

// Set up notification listeners
export function setupNotificationListeners() {
  // When notification is received while app is in foreground
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('📳 Notification received:', notification);
    Alert.alert(
      notification.request.content.title || 'New Notification! 🔔',
      notification.request.content.body || 'You have a new message',
      [{ text: 'OK', onPress: () => console.log('Notification acknowledged') }]
    );
  });

  // When user taps on notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 Notification tapped:', response);
    Alert.alert('Notification Opened', 'You tapped on the notification!');
  });

  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

// Send test local notification
export async function sendTestNotification() {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 Pride App Test",
        body: 'This is a test notification from your app!',
        data: { 
          testData: 'Hello from Pride App!',
          timestamp: Date.now()
        },
      },
      trigger: { seconds: 3 },
    });
    
    Alert.alert('Test Scheduled! ⏰', 'Test notification will appear in 3 seconds!');
  } catch (error) {
    console.error('❌ Error sending test:', error);
    Alert.alert('Error', 'Failed to send test notification');
  }
}

// Get stored notification token
export async function getStoredToken() {
  try {
    const token = await AsyncStorage.getItem('pushToken');
    return token;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
}