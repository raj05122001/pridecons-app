// app/(drawer)/_layout.tsx
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Drawer } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import { decodeAuthToken, useAuth } from '@/contexts/AuthContext';

export interface DecodedAuthToken {
  sub: string;
  exp: number;
  iat: number;
  // add any custom claims you expect, e.g.:
  name?: string;
  role?: string;
  phone_number?: string;
}


const { width } = Dimensions.get('window');

// Custom Drawer Content Component
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { logout } = useAuth();
  const [userDetails, setUserDetails] = useState<DecodedAuthToken | null>()

  useEffect(() => {
    fun()
  }, [])
  const fun = async () => {
    const res = await decodeAuthToken()
    setUserDetails(res)
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Header Section with Gradient */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.drawerHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.headerPattern}>
          <View style={[styles.patternCircle, styles.circle1]} />
          <View style={[styles.patternCircle, styles.circle2]} />
          <View style={[styles.patternCircle, styles.circle3]} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {/* User Avatar */}
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.profileAvatar}
            >
              <Icon name="person" size={28} color="#667EEA" />
            </LinearGradient>
            {/* Online Status */}
            <View style={styles.onlineIndicator} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userDetails?.name}</Text>
            <Text style={styles.profileEmail}>{userDetails?.sub}</Text>
            <View style={styles.profileBadge}>
              <Icon name="shield-checkmark" size={12} color="#10B981" />
              <Text style={styles.badgeText}>Premium</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Navigation Content */}
      <DrawerContentScrollView
        {...props}
        style={styles.navigationContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Navigation */}
        <View style={styles.navigationSection}>
          <DrawerItemList {...props} />
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.appInfo}>
            <Icon name="information-circle-outline" size={16} color="#94A3B8" />
            <Text style={styles.appInfoText}>Version 2.1.0</Text>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#FEF2F2', '#FECACA']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.logoutIconContainer}>
              <Icon name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
            <Icon name="arrow-forward" size={16} color="#EF4444" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          drawerStyle: {
            backgroundColor: 'transparent',
            width: Math.min(width * 0.85, 320),
          },
          headerStyle: {
            backgroundColor: '#667EEA',
            elevation: 4,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          drawerActiveBackgroundColor: 'rgba(102, 126, 234, 0.1)',
          drawerActiveTintColor: '#667EEA',
          drawerInactiveTintColor: '#64748B',
          drawerLabelStyle: {
            marginLeft: -16,
            fontSize: 16,
            fontWeight: '500',
          },
          drawerItemStyle: {
            marginHorizontal: 12,
            marginVertical: 2,
            borderRadius: 12,
            paddingLeft: 8,
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',
            drawerIcon: ({ color, size, focused }) => (
              <View style={[styles.drawerIconContainer, focused && styles.drawerIconActive]}>
                <Icon
                  name={focused ? 'grid' : 'grid-outline'}
                  size={22}
                  color={focused ? '#667EEA' : color}
                />
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Ipo"
          options={{
            drawerLabel: 'IPO Analytics',
            title: 'IPO',
            drawerIcon: ({ color, size, focused }) => (
              <View style={[styles.drawerIconContainer, focused && styles.drawerIconActive]}>
                <Icon
                  name={focused ? 'trending-up' : 'trending-up-outline'}
                  size={22}
                  color={focused ? '#667EEA' : color}
                />
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="CorporateAction"
          options={{
            drawerLabel: 'Corporate Actions',
            title: 'Corporate Actions',
            drawerIcon: ({ color, size, focused }) => (
              <View style={[styles.drawerIconContainer, focused && styles.drawerIconActive]}>
                <Icon
                  name={focused ? 'business' : 'business-outline'}
                  size={22}
                  color={focused ? '#667EEA' : color}
                />
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="CorporateCalender"
          options={{
            drawerLabel: 'Corporate Calendar',
            title: 'Corporate Calendar',
            drawerIcon: ({ color, size, focused }) => (
              <View style={[styles.drawerIconContainer, focused && styles.drawerIconActive]}>
                <Icon
                  name={focused ? 'calendar' : 'calendar-outline'}
                  size={22}
                  color={focused ? '#667EEA' : color}
                />
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="(more)/About"
          options={{
            drawerLabel: 'About',
            title: 'About',
            drawerIcon: ({ color, size, focused }) => (
              <View style={[styles.drawerIconContainer, focused && styles.drawerIconActive]}>
                <Icon
                  name={focused ? 'information-circle' : 'information-circle-outline'}
                  size={22}
                  color={focused ? '#667EEA' : color}
                />
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="(more)/TermsConditions"
          options={{
            drawerLabel: 'Terms & Conditions',
            title: 'TermsConditions',
            drawerIcon: ({ color, size, focused }) => (
              <View style={[styles.drawerIconContainer, focused && styles.drawerIconActive]}>
                <Icon
                  name={focused ? 'document-text' : 'document-text-outline'}
                  size={22}
                  color={focused ? '#667EEA' : color}
                />
              </View>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 100,
    height: 100,
    top: -30,
    right: -30,
  },
  circle2: {
    width: 60,
    height: 60,
    top: 20,
    left: -10,
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: -20,
    right: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  navigationContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navigationSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 12,
    marginLeft: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  drawerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 10
  },
  drawerIconActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  additionalSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  appInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfoText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 6,
    fontWeight: '500',
  },
  logoutSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  logoutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});