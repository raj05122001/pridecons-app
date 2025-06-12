import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [initialRoute, setInitialRoute] = useState<string | undefined>(undefined);

    useEffect(() => {
    // Decide initial route based on stored authentication tokens
    (async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log("token : ",token)
      setInitialRoute(token ? '(tabs)' : 'login');
    })();
  }, []);


  if (!loaded || initialRoute === null) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen name="login" options={{ headerShown: false }}/>
        <Stack.Screen name="signup" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="forgotPassword" options={{ headerShown: false }}/>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
