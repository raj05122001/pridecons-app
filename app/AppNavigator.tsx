// AppNavigator.tsx
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

// import your screens
import Disclosure from '@/app/(drawer)/(tabs)/disclosure';
import Home from "@/app/(drawer)/(tabs)/home";
import News from '@/app/(drawer)/(tabs)/news';

const Drawer = createDrawerNavigator();

// Optional: custom drawer content
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {/* e.g. a log-out button at the bottom */}
      <DrawerItem
        label="Log out"
        onPress={() => {
          // ...
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,      // shows a header with hamburger
          drawerType: 'slide',    // or 'front' / 'back'
        }}
      >
        <Drawer.Screen name="Home"      component={Home} />
        <Drawer.Screen name="News"      component={News} />
        <Drawer.Screen name="Disclosure" component={Disclosure} />
        {/* add more screens here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
