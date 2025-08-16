// app/master-data/portionsize.tsx

// Version: 1.0.0
// Date: 2025-08-16
// Changes: Initial creation of Portion Sizes CRUD screen

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { MasterDataList } from '@/components/MasterDataList';

// Mock data for Portion Sizes
const MOCK_PORTION_SIZES = [
  { id: '1', name: 'Small' },
  { id: '2', name: 'Medium' },
  { id: '3', name: 'Large' },
  { id: '4', name: 'Extra Large' },
];

export default function PortionSizeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [portionSizes, setPortionSizes] = useState(MOCK_PORTION_SIZES);

  const handleAddItem = (name: string) => {
    const newItem = {
      id: Date.now().toString(),
      name: name,
    };
    setPortionSizes([...portionSizes, newItem]);
  };

  const handleUpdateItem = (id: string, newName: string) => {
    setPortionSizes(portionSizes.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setPortionSizes(portionSizes.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Portion Sizes" />
      
      <View style={styles.container}>
        <MasterDataList
          items={portionSizes}
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