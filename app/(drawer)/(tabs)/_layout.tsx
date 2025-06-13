// app/(drawer)/(tabs)/_layout.tsx
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      {/* Background with blur effect */}
      <View style={styles.tabBarBackground}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={90} tint="dark" style={styles.blurView} />
        ) : (
          <LinearGradient
            colors={['rgba(31,41,55,0.95)', 'rgba(31,41,55,0.9)']} // dark slate background
            style={styles.gradientBackground}
          />
        )}
        
        {/* Active tab indicator background */}
        <LinearGradient
          colors={['#7C3AED', '#4F46E5']} // purple to indigo gradient
          style={[
            styles.activeIndicator,
            {
              left: (width / state.routes.length) * state.index + 10,
              width: (width / state.routes.length) - 20,
            },
          ]}
        />
      </View>

      {/* Tab buttons */}
      <View style={styles.tabButtonsContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const getIconName = (routeName: string, focused: boolean) => {
            const iconMap: { [key: string]: { focused: string; unfocused: string } } = {
              home: { focused: 'home', unfocused: 'home-outline' },
              news: { focused: 'newspaper', unfocused: 'newspaper-outline' },
              research: { focused: 'analytics', unfocused: 'analytics-outline' },
              disclosure: { focused: 'document-text', unfocused: 'document-text-outline' },
              profile: { focused: 'person', unfocused: 'person-outline' },
            };
            
            return focused 
              ? iconMap[routeName]?.focused || 'ellipse'
              : iconMap[routeName]?.unfocused || 'ellipse-outline';
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabButton, isFocused && styles.activeTabButton]}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Icon
                  name={getIconName(route.name, isFocused)}
                  size={isFocused ? 26 : 24}
                  color={isFocused ? '#E0E7FF' : '#9CA3AF'} // light purple vs gray
                  style={styles.tabIcon}
                />
                <Text 
                  style={[
                    styles.tabLabel,
                    { 
                      color: isFocused ? '#E0E7FF' : '#9CA3AF',
                      fontWeight: isFocused ? '700' : '500',
                      fontSize: isFocused ? 12 : 11,
                    }
                  ]}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarLabel: 'News',
        }}
      />
      <Tabs.Screen
        name="disclosure"
        options={{
          title: 'Disclosure',
          tabBarLabel: 'Policy',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 2,
  },
  tabButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  activeTabButton: {
    transform: [{ scale: 1.05 }],
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});