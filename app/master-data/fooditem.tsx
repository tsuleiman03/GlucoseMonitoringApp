// app/master-data/fooditem.tsx

// Version: 1.0.0
// Date: 2025-08-16
// Changes: Initial creation of Food Items CRUD screen

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { MasterDataList } from '@/components/MasterDataList';

// Mock data for Food Items
const MOCK_FOOD_ITEMS = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Banana' },
  { id: '3', name: 'Chicken Breast' },
  { id: '4', name: 'Broccoli' },
  { id: '5', name: 'Rice' },
];

export default function FoodItemScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [foodItems, setFoodItems] = useState(MOCK_FOOD_ITEMS);

  const handleAddItem = (name: string) => {
    const newItem = {
      id: Date.now().toString(),
      name: name,
    };
    setFoodItems([...foodItems, newItem]);
  };

  const handleUpdateItem = (id: string, newName: string) => {
    setFoodItems(foodItems.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Food Items" />
      
      <View style={styles.container}>
        <MasterDataList
          items={foodItems}
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