// app/_layout.tsx
import { registerForPushNotificationsAsync, setupNotificationListeners } from '@/components/notificationService';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

// Notification setup useEffect
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        console.log('🚀 Initializing notifications...');
        
        // Register for notifications
        const notificationToken = await registerForPushNotificationsAsync();
        
        if (notificationToken) {
          console.log('✅ Notification setup complete!');
        }
        
        // Setup listeners
        const cleanup = setupNotificationListeners();
        
        return cleanup;
      } catch (error) {
        console.error('❌ Notification setup error:', error);
      }
    };

    initializeNotifications();
  }, []);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // Authenticated screens with drawer
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        ) : (
          // Authentication screens
          <>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="+not-found" />
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