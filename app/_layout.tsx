// app/_layout.tsx
import { AuthProvider, decodeAuthToken, useAuth } from '@/contexts/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import axios from 'axios';
import * as Device from 'expo-device';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, useColorScheme, View } from 'react-native';

export interface DecodedAuthToken {
  sub: string;
  exp: number;
  iat: number;
  name?: string;
  role?: string;
  phone_number?: string;
}

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [userDetails, setUserDetails] = useState<DecodedAuthToken | null>(null);
  const [isPlanActive, setIsPlanActive] = useState<boolean>(true);
  const [isPlanLoader, setIsPlanLoader] = useState<boolean>(true);
  const { isAuthenticated, isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  const checkToken = async () => {
  try {
    const res = await decodeAuthToken()
    setUserDetails(res)
    
    if (!res?.phone_number) {
      setIsPlanLoader(false);
    }
  } catch (error) {
    console.error(error);
    setIsPlanLoader(false);
    // Should probably set userDetails to null on error
    setUserDetails(null);
  }
}

useEffect(() => {
  checkToken()
}, [checkToken])

  // Setup push notifications
  useEffect(() => {
    if (userDetails?.phone_number) {
      registerForPushNotificationsAsync()
        .then(token => {
          if (token) {
            console.log('📱 Push token received:', token);
            // Register token with backend
            updateToken(token, userDetails);
          } else {
            console.log('❌ No push token available');
          }
        })
        .catch(error => {
          console.warn('❌ Push notification registration failed:', error);
        });

    }

    // Listen for notifications while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📨 Notification received in foreground:', notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 User tapped notification:', response);
      // Handle notification tap - navigate to specific screen if needed
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [userDetails]);

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    // Handle notification tap - you can navigate to specific screens here
    const data = response.notification.request.content.data;
    console.log('Notification data:', data);

    // Example: Navigate based on notification data
    // if (data?.type === 'message') {
    //   router.push('/messages');
    // } else if (data?.type === 'news') {
    //   router.push('/news');
    // }
  };

  const updateToken = async (token: string, userDetail: any) => {
    try {
      console.log('🔄 Registering token with backend...');

      const response = await axios.post(
        'https://api.pridecons.sbs/notification/users/register-push-token',
        {
          user_id: userDetail.phone_number, // You might want to use actual user ID
          push_token: token
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log('✅ Token registered successfully:', response.data);
    } catch (error) {
      console.error('❌ Failed to register token:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          console.error('Network error - no response received');
        }
      }
    }
  };

  useEffect(() => {
    console.log("userDetails?.phone_number:", userDetails?.phone_number);
    if (userDetails?.phone_number) {
      checkSubscription();
    }
  }, [userDetails?.phone_number]);

  const checkSubscription = async () => {
    try {
      const response = await axios.get(
        `https://api.pridecons.sbs/plan/check-plan/${userDetails?.phone_number}`,
        { timeout: 10000 }
      );

      console.log("Plan check response:", response?.data);
      setIsPlanActive(response?.data?.active);
    } catch (error) {
      console.error('Plan check failed:', error);
      // Default to active if API fails
      setIsPlanActive(true);
    } finally {
      setIsPlanLoader(false);
    }
  };

  // Loading state
  console.log("loaded:", loaded, ", isLoading:", isLoading, ", isPlanLoader:", isPlanLoader);
  if (!loaded || isLoading || isPlanLoader) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={
          isAuthenticated
            ? isPlanActive
              ? '(drawer)'
              : 'ExpirePlan'
            : 'login'
        }
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name="ExpirePlan" />
          </>
        ) : (
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forgotPassword" />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Enhanced push notification registration
async function registerForPushNotificationsAsync(): Promise<string> {
  let token: string = '';

  // Check if running on physical device
  if (!Device.isDevice) {
    Alert.alert(
      'Physical Device Required',
      'Push notifications require a physical device. Simulators/emulators are not supported.',
      [{ text: 'OK' }]
    );
    return token;
  }

  // Check current permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Handle permission denial
  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Push notifications require permission to work properly. Please enable notifications in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settings',
          onPress: () => {
            // Open device settings (you might need to install expo-linking)
            // Linking.openSettings();
          }
        }
      ]
    );
    return token;
  }

  try {
    // Get the push token
    const pushTokenData = await Notifications.getDevicePushTokenAsync();
    token = pushTokenData.data;
    console.log('✅ Push token generated successfully');
  } catch (error) {
    console.error('❌ Failed to get push token:', error);
    Alert.alert(
      'Token Generation Failed',
      'Failed to generate push notification token. Please try again.',
      [{ text: 'OK' }]
    );
    return '';
  }

  // Configure Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default'
    });
    console.log('✅ Android notification channel configured');
  }

  return token;
}