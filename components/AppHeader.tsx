// components/AppHeader.tsx

// Version: 1.1.0
// Date: 2025-08-16
// Changes: 
// - Implemented navigation to the master-data screen.
// - Initial creation of the reusable header component.

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router'; // CHANGE: Import useRouter
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from './ui/IconSymbol';

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const router = useRouter(); // CHANGE: Initialize the router

  const onSettingsPress = () => {
    // CHANGE: Implement navigation
    router.push('/(tabs)/master-data');
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.headerTitle, { color: themeColors.text }]}>{title}</Text>
      <Pressable onPress={onSettingsPress} style={styles.settingsIcon}>
        <IconSymbol name="gear" size={24} color={themeColors.tint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // A neutral border color
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    right: 16,
  },
});
