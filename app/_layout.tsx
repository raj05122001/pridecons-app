// app/_layout.tsx
import { AuthProvider, decodeAuthToken, useAuth } from '@/contexts/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';

export interface DecodedAuthToken {
  sub: string;
  exp: number;
  iat: number;
  name?: string;
  role?: string;
  phone_number?: string;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [userDetails, setUserDetails] = useState<DecodedAuthToken | null>(null);
  const [isPlanActive, setIsPlanActive] = useState<boolean>(true);
  const [isPlanLoader, setIsPlanLoader] = useState<Boolean>(true)
  
  // 1️⃣ Get decoded token
  useEffect(() => {
    decodeAuthToken().then(setUserDetails).catch(() => {
      setIsPlanActive(false)
    });
  }, []);

  useEffect(() => {
    console.log("userDetails?.phone_number : ",userDetails)
    if (userDetails?.phone_number) {
      checkSubscription()
    }else{
      setIsPlanLoader(false)
    }
  }, [userDetails?.phone_number]);

  const checkSubscription = async () => {
    try {
      await axios
        .get(
          `https://api.pridecons.sbs/plan/check-plan/${userDetails.phone_number}`
        )
        .then(response => {
          console.log("response : ", response?.data)
          setIsPlanActive(response?.data?.active);
          setIsPlanLoader(false)
        })
        .catch(() => {
          // if API fails, you can choose to block access or default to active
          setIsPlanActive(true);
          setIsPlanLoader(false)
        });
    } catch (error) {
      setIsPlanLoader(false)
    }finally{
      setIsPlanLoader(false)
    }
  }

  // 4️⃣ Loading state
  console.log("loaded : ", loaded, " , isLoading : ", isLoading, " , isPlanLoader : ", isPlanLoader)
  if (!loaded || isLoading || isPlanLoader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
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
            <Stack.Screen
              name="ExpirePlan"
            />
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
