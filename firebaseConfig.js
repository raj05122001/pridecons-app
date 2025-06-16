// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAPC8jGVKi8Fh5s3rDfwqxF0YxL5NGAls",
  authDomain: "pridetrading-6a03b.firebaseapp.com", 
  projectId: "pridetrading-6a03b",
  storageBucket: "pridetrading-6a03b.firebasestorage.app",
  messagingSenderId: "273550335578",
  appId: "1:273550335578:android:a26ea5c56f4fe9bf098263"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { firebaseConfig, messaging };

// For mobile apps using React Native Firebase
export const getFirebaseToken = async () => {
  try {
    // For React Native, import from @react-native-firebase/messaging
    const messaging = require('@react-native-firebase/messaging').default;
    
    // Request permission first
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // Get FCM token
      const token = await messaging().getToken();
      console.log('Firebase FCM Token:', token);
      return token;
    } else {
      console.log('Permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
};