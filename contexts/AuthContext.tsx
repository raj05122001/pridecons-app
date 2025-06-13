// contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface DecodedAuthToken {
  sub: string;
  exp: number;
  iat: number;
  // add any custom claims you expect, e.g.:
  name?: string;
  role?: string;
  phone_number?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token found:', !!token);
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, refreshToken?: string) => {
    try {
      console.log('Logging in...');
      await AsyncStorage.setItem('accessToken', token);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      setIsAuthenticated(true);
      console.log('Login successful, navigating to drawer...');
      router.replace('/(drawer)');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      console.log('Logout successful, navigating to login...');
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get auth token
export async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export async function decodeAuthToken(): Promise<DecodedAuthToken | null> {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return null;

    // this will throw if token is malformed
    const decoded = jwtDecode<DecodedAuthToken>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding auth token:', error);
    return null;
  }
}

// Helper function to check if user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}

// Helper function to clear all auth data
export async function clearAuthData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    console.log('Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}