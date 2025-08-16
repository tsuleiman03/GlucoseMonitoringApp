// app/master-data/effortlevel.tsx

// Version: 1.0.0
// Date: 2025-08-16
// Changes: Initial creation of Effort Levels CRUD screen

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { MasterDataList } from '@/components/MasterDataList';

// Mock data for Effort Levels
const MOCK_EFFORT_LEVELS = [
  { id: '1', name: 'Low' },
  { id: '2', name: 'Moderate' },
  { id: '3', name: 'High' },
  { id: '4', name: 'Intense' },
];

export default function EffortLevelScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [effortLevels, setEffortLevels] = useState(MOCK_EFFORT_LEVELS);

  const handleAddItem = (name: string) => {
    const newItem = {
      id: Date.now().toString(),
      name: name,
    };
    setEffortLevels([...effortLevels, newItem]);
  };

  const handleUpdateItem = (id: string, newName: string) => {
    setEffortLevels(effortLevels.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setEffortLevels(effortLevels.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Effort Levels" />
      
      <View style={styles.container}>
        <MasterDataList
          items={effortLevels}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});