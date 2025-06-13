// notificationService.js (Testing Version)
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

// Notification behavior configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications (Mock version)
export async function registerForPushNotificationsAsync() {
  console.log('🔔 Setting up notifications...');
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please allow notifications to continue!');
      return null;
    }
    
    // Create mock token for testing
    const mockToken = `pride-app-token-${Date.now()}`;
    console.log('✅ Mock Token Created:', mockToken);
    
    // Store token in AsyncStorage
    await AsyncStorage.setItem('notificationToken', mockToken);
    
    Alert.alert('Success! 🎉', 'Notifications are ready for testing!');
    
    return mockToken;
  } else {
    Alert.alert('Device Required', 'Physical device needed for notifications');
    return null;
  }
}

// Setup notification listeners
export function setupNotificationListeners() {
  console.log('👂 Setting up notification listeners...');
  
  // When notification received while app is open
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('📨 Notification received:', notification);
    Alert.alert(
      '📱 New Notification',
      notification.request.content.body || 'You have a new notification!',
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

// Simulate push notification from server
export function simulatePushNotification() {
  Alert.alert(
    '🔔 Push Notification Demo',
    'This simulates receiving a push notification from your server. In production, this would come from Firebase!',
    [
      { 
        text: 'Dismiss', 
        style: 'cancel' 
      },
      { 
        text: 'Open App', 
        onPress: () => console.log('Push notification opened app')
      }
    ]
  );
}

// Get stored notification token
export async function getStoredToken() {
  try {
    const token = await AsyncStorage.getItem('notificationToken');
    return token;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
}