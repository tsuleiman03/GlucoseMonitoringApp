// components/AppHeader.tsx

// Version: 1.4.0
// Date: 2025-08-16
// Changes: 
// - CHANGE: Reverted to simple consistent H1 layout for all screens
// - CHANGE: Removed back button functionality (not needed)
// - CHANGE: Removed absolute positioning (not needed)
// - CHANGE: Fixed vertical alignment of gear icon with title text
// - CHANGE: Consistent header layout: title left, gear right, same line

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from './ui/IconSymbol';

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  const onSettingsPress = () => {
    router.push('/(tabs)/master-data');
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: themeColors.background, borderBottomColor: themeColors.icon }]}>
      <Text style={[styles.headerTitle, { color: themeColors.text }]}>{title}</Text>
      <Pressable onPress={onSettingsPress} style={styles.settingsButton}>
        <IconSymbol name="gear" size={24} color={themeColors.tint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});