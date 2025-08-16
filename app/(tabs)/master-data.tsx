// app/(tabs)/master-data.tsx

// Version: 1.0.0
// Date: 2025-08-16
// Changes: Initial creation of the master data placeholder screen.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AppHeader } from '@/components/AppHeader';

export default function MasterDataScreen() {
  return (
    <ThemedView style={styles.container}>
      <AppHeader title="Master Data" />
      <View style={styles.content}>
        <ThemedText type="title">Master Data</ThemedText>
        <ThemedText>This screen will contain forms to manage reference data.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
