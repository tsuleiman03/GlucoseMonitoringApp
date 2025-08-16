// app/master-data/exercisetype.tsx

// Version: 1.0.0
// Date: 2025-08-16
// Changes: Initial creation of Exercise Types CRUD screen

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { MasterDataList } from '@/components/MasterDataList';

// Mock data for Exercise Types
const MOCK_EXERCISE_TYPES = [
  { id: '1', name: 'Walking' },
  { id: '2', name: 'Running' },
  { id: '3', name: 'Cycling' },
  { id: '4', name: 'Swimming' },
  { id: '5', name: 'Weight Training' },
];

export default function ExerciseTypeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [exerciseTypes, setExerciseTypes] = useState(MOCK_EXERCISE_TYPES);

  const handleAddItem = (name: string) => {
    const newItem = {
      id: Date.now().toString(),
      name: name,
    };
    setExerciseTypes([...exerciseTypes, newItem]);
  };

  const handleUpdateItem = (id: string, newName: string) => {
    setExerciseTypes(exerciseTypes.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setExerciseTypes(exerciseTypes.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Exercise Types" />
      
      <View style={styles.container}>
        <MasterDataList
          items={exerciseTypes}
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