// app/(tabs)/master-data.tsx

// Version: 1.3.0
// Date: 2025-08-16
// Changes: 
// - FIXED: Removed the outer ScrollView to prevent VirtualizedList nesting error.
// - Integrated the MasterDataList component to display food items.
// - Implemented the tabbed UI skeleton for the Master Data Setup Wizard.

import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { MasterDataList } from '@/components/MasterDataList';

type MasterDataTab = 'fooditem' | 'portionsize' | 'exercisetype' | 'effortlevel';

const TABS: { id: MasterDataTab; title: string }[] = [
  { id: 'fooditem', title: 'Food Items' },
  { id: 'portionsize', title: 'Portion Sizes' },
  { id: 'exercisetype', title: 'Exercise Types' },
  { id: 'effortlevel', title: 'Effort Levels' },
];

// Mock data for demonstration
const MOCK_FOOD_ITEMS = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Chicken Breast' },
];

export default function MasterDataScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState<MasterDataTab>('fooditem');

  const [foodItems, setFoodItems] = useState(MOCK_FOOD_ITEMS);

  const renderContent = () => {
    switch (activeTab) {
      case 'fooditem':
        return (
          <MasterDataList
            items={foodItems}
            onAddItem={(name) => setFoodItems([...foodItems, { id: Date.now().toString(), name }])}
            onUpdateItem={(id, newName) => console.log('Update', id, newName)}
            onDeleteItem={(id) => setFoodItems(foodItems.filter(item => item.id !== id))}
          />
        );
      case 'portionsize':
      case 'exercisetype':
      case 'effortlevel':
      default:
        return (
          <View style={styles.contentPlaceholder}>
            <ThemedText>Content for {TABS.find(t => t.id === activeTab)?.title}</ThemedText>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Master Data Setup" />
      
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && { borderBottomColor: themeColors.tint, borderBottomWidth: 2 }
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <ThemedText style={[styles.tabTitle, activeTab === tab.id && { color: themeColors.tint }]}>
              {tab.title}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* CHANGE: Replaced ScrollView with a regular View */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    flex: 1, // Allow the container to fill the available space
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
