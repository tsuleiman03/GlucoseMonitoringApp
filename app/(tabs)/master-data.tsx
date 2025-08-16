// app/(tabs)/master-data.tsx

// Version: 2.1.0
// Date: 2025-08-16
// Changes: 
// - CHANGE: Replaced horizontal tabs with vertical list navigation
// - CHANGE: Added all database tables from schema
// - CHANGE: Implemented navigation to individual table management screens
// - CHANGE: Scalable design for future table additions
// - CHANGE: Updated navigation to route to /master-data/{tableId} screens

import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

type MasterDataTable = {
  id: string;
  name: string;
  description: string;
  category: 'food' | 'exercise' | 'medical';
};

const MASTER_DATA_TABLES: MasterDataTable[] = [
  { id: 'fooditem', name: 'Food Items', description: 'Manage food and drink items', category: 'food' },
  { id: 'portionsize', name: 'Portion Sizes', description: 'Define serving sizes (small, medium, large)', category: 'food' },
  { id: 'exercisetype', name: 'Exercise Types', description: 'Types of physical activities', category: 'exercise' },
  { id: 'effortlevel', name: 'Effort Levels', description: 'Exercise intensity levels', category: 'exercise' },
];

export default function MasterDataScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  const handleTablePress = (tableId: string) => {
    // Navigate to individual table management screen
    router.push(`/master-data/${tableId}` as any);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return 'leaf.fill';
      case 'exercise': return 'figure.run';
      case 'medical': return 'cross.fill';
      default: return 'doc.text';
    }
  };

  const renderTableItem = ({ item }: { item: MasterDataTable }) => (
    <Pressable
      style={[styles.tableItem, { borderBottomColor: themeColors.icon }]}
      onPress={() => handleTablePress(item.id)}
    >
      <View style={styles.tableItemLeft}>
        <IconSymbol 
          name={getCategoryIcon(item.category)} 
          size={24} 
          color={themeColors.tint} 
        />
        <View style={styles.tableItemText}>
          <ThemedText style={[styles.tableItemTitle, { color: themeColors.text }]}>
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.tableItemDescription, { color: themeColors.icon }]}>
            {item.description}
          </ThemedText>
        </View>
      </View>
      <IconSymbol name="chevron.right" size={20} color={themeColors.icon} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Master Data Setup" />
      
      <ScrollView style={styles.container}>
        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: themeColors.text }]}>
            Database Tables
          </ThemedText>
          <ThemedText style={[styles.sectionSubtitle, { color: themeColors.icon }]}>
            Configure your master data
          </ThemedText>
        </View>

        {MASTER_DATA_TABLES.map((table) => (
          <View key={table.id}>
            {renderTableItem({ item: table })}
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
  },
  tableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  tableItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tableItemText: {
    marginLeft: 16,
    flex: 1,
  },
  tableItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  tableItemDescription: {
    fontSize: 14,
  },
  bottomSpacer: {
    height: 100,
  },
});