// components/DrawerButton.tsx
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface DrawerButtonProps {
  size?: number;
  color?: string;
  style?: any;
  backgroundColor?: string;
}

export default function DrawerButton({ 
  size = 24, 
  color = '#FFFFFF', 
  style,
  backgroundColor = '#6366F1' 
}: DrawerButtonProps) {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <TouchableOpacity 
      style={[styles.drawerButton, { backgroundColor }, style]} 
      onPress={openDrawer}
      activeOpacity={0.7}
    >
      <Icon name="menu" size={size} color={color} />
    </TouchableOpacity>
  );
}

// Alternative: Simple Icon Button (without background)
export function DrawerIconButton({ 
  size = 24, 
  color = '#6366F1', 
  style 
}: DrawerButtonProps) {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <TouchableOpacity 
      style={[styles.iconButton, style]} 
      onPress={openDrawer}
      activeOpacity={0.7}
    >
      <Icon name="menu" size={size} color={color} />
    </TouchableOpacity>
  );
}

// Alternative: Floating Action Button style
export function DrawerFAB({ 
  size = 20, 
  color = '#FFFFFF', 
  style 
}: DrawerButtonProps) {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <TouchableOpacity 
      style={[styles.fab, style]} 
      onPress={openDrawer}
      activeOpacity={0.8}
    >
      <Icon name="menu" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  drawerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});