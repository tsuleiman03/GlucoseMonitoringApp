// app/(tabs)/index.tsx

// Version: 3.1.0
// Date: 2025-08-16
// Changes: 
// - Adjusted the position and size of the floating action button for better visibility.
// - Refactored into a dashboard skeleton. The original form has been moved to app/add-measurement.tsx.

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  const handleAddPress = () => {
    router.push('/add-measurement');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Dashboard" />
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={[styles.card, { backgroundColor: themeColors.card }]}>
          <ThemedText style={styles.cardTitle}>Last 5 Days</ThemedText>
          <View style={styles.placeholder}>
            <ThemedText style={{color: themeColors.icon}}>List of recent readings will go here.</ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: themeColors.card }]}>
          <ThemedText style={styles.cardTitle}>Trends</ThemedText>
           <View style={styles.placeholder}>
            <ThemedText style={{color: themeColors.icon}}>Graph of recent trends will go here.</ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
      
      {/* CHANGE: Increased size and adjusted position of the button */}
      <Pressable style={[styles.fab, { backgroundColor: themeColors.tint }]} onPress={handleAddPress}>
        <IconSymbol name="plus" size={40} color={themeColors.background} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 80, // Space for the FAB
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  placeholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  // CHANGE: Adjusted styles for the button
  fab: {
    position: 'absolute',
    bottom: 90, // Increased to clear tab bar
    right: 30,
    width: 70,  // Increased size
    height: 70, // Increased size
    borderRadius: 35, // Adjusted for new size
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
