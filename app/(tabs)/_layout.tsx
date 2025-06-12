import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      {/* Background with blur effect */}
      <View style={styles.tabBarBackground}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} style={styles.blurView} />
        ) : (
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
            style={styles.gradientBackground}
          />
        )}
        
        {/* Active tab indicator background */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
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
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
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

          // Icon mapping
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
                  color={isFocused ? '#fff' : '#666'}
                  style={styles.tabIcon}
                />
                <Text 
                  style={[
                    styles.tabLabel,
                    { 
                      color: isFocused ? '#fff' : '#666',
                      fontWeight: isFocused ? '700' : '500',
                      fontSize: isFocused ? 12 : 11,
                    }
                  ]}
                >
                  {label}
                </Text>
                
                {/* Notification badge for some tabs */}
                {(route.name === 'news' || route.name === 'research') && !isFocused && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>
                      {route.name === 'news' ? '3' : '2'}
                    </Text>
                  </View>
                )}
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
        name="research"
        options={{
          title: 'Research',
          tabBarLabel: 'Research',
        }}
      />
      <Tabs.Screen
        name="disclosure"
        options={{
          title: 'Disclosure',
          tabBarLabel: 'Legal',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = {
  tabBarContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  tabBarBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden' as const,
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
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  activeIndicator: {
    position: 'absolute' as const,
    top: 8,
    height: 45,
    borderRadius: 22.5,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButtonsContainer: {
    flexDirection: 'row' as const,
    height: 56,
    paddingTop: 8,
    paddingHorizontal: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 22.5,
  },
  activeTabButton: {
    // Active styles are handled by the gradient indicator
  },
  tabContent: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  notificationBadge: {
    position: 'absolute' as const,
    top: -5,
    right: -8,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
};

// Alternative simpler version if the above is too complex
export const SimpleTabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'home' : 'home-outline'} 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <Icon 
                name={focused ? 'newspaper' : 'newspaper-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
              />
              {!focused && (
                <View style={{
                  position: 'absolute',
                  top: -5,
                  right: -8,
                  backgroundColor: '#ff6b6b',
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#fff',
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: '700',
                  }}>3</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="research"
        options={{
          title: 'Research',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <Icon 
                name={focused ? 'analytics' : 'analytics-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
              />
              {!focused && (
                <View style={{
                  position: 'absolute',
                  top: -5,
                  right: -8,
                  backgroundColor: '#ff6b6b',
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#fff',
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: '700',
                  }}>2</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="disclosure"
        options={{
          title: 'Legal',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'document-text' : 'document-text-outline'} 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'person' : 'person-outline'} 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
};